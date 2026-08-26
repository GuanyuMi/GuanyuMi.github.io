import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { parseResumeData, type Locale, type ResumeData } from '@portfolio/resume-schema';
import EditorPane from './components/EditorPane';
import LoginPanel from './components/LoginPanel';
import PreviewPane from './components/PreviewPane';
import ResumeForm from './components/ResumeForm';
import Toolbar from './components/Toolbar';
import { createResumePdf } from './lib/exportPdf';
import { hasSupabaseConfig, supabase } from './lib/supabase';
import type { ResumeBalance, ResumeVisibility } from './types';

const locales: Locale[] = ['en', 'zh'];

const defaultVisibility: ResumeVisibility = {
  basics: { role: true, field: true, contact: true, location: true, profiles: true, about: false, photo: false },
  sections: { education: true, skills: true, experience: true, projects: true },
  items: {},
  bullets: {},
};

const visibilityKey = (language: Locale) => `resume-visibility-${language}`;
const balanceKey = (language: Locale) => `resume-balance-${language}`;
const defaultBalance: ResumeBalance = { auto: true, adjustment: 0 };

const loadStored = <T,>(key: string, fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
};

const getLocalResume = async (locale: Locale) => {
  const response = await fetch(`/api/resumes/${locale}`);
  if (!response.ok) throw new Error(`Could not load private-resume/resume.${locale}.json`);
  const result = parseResumeData(await response.json());
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? 'Resume data is invalid.');
  return result.data;
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [language, setLanguage] = useState<Locale>('zh');
  const [drafts, setDrafts] = useState<Record<Locale, ResumeData> | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Locale, string>>>({});
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<string | null>('Loading local resume files…');
  const [visibility, setVisibility] = useState<ResumeVisibility>(() => loadStored(visibilityKey('zh'), defaultVisibility));
  const [balance, setBalance] = useState<ResumeBalance>(() => loadStored(balanceKey('zh'), defaultBalance));

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    void Promise.all(locales.map(getLocalResume)).then(([en, zh]) => {
      setDrafts({ en, zh });
      setStatus('Editing private-resume files locally.');
    }).catch((error: Error) => setStatus(error.message));
  }, []);

  useEffect(() => {
    setVisibility(loadStored(visibilityKey(language), defaultVisibility));
    setBalance(loadStored(balanceKey(language), defaultBalance));
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(visibilityKey(language), JSON.stringify(visibility));
  }, [language, visibility]);

  useEffect(() => {
    window.localStorage.setItem(balanceKey(language), JSON.stringify(balance));
  }, [language, balance]);

  const handleContentChange = (data: ResumeData) => {
    if (!drafts) return;
    const result = parseResumeData(data);
    setDrafts({ ...drafts, [language]: data });
    setErrors({ ...errors, [language]: result.success ? undefined : result.error.issues[0]?.message ?? 'Resume data is invalid.' });
  };

  const saveLocal = async (): Promise<boolean> => {
    if (!drafts || errors[language]) return false;
    setStatus('Saving locally…');
    const response = await fetch(`/api/resumes/${language}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drafts[language]),
    });
    const message = await response.json() as { error?: string };
    setStatus(response.ok ? 'Saved to private-resume.' : (message.error ?? 'Could not save locally.'));
    return response.ok;
  };

  const publish = async () => {
    if (!supabase || !session || !drafts || !await saveLocal()) return;
    setStatus('Publishing…');
    const { error: draftError } = await supabase
      .from('resume_drafts')
      .upsert({ locale: language, content: drafts[language], updated_at: new Date().toISOString() });
    if (draftError) {
      setStatus(draftError.message);
      return;
    }
    const { error } = await supabase.rpc('publish_resume', { target_locale: language });
    setStatus(error ? error.message : 'Published to Supabase.');
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Supabase is not configured.';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  const exportPdf = async () => {
    const page = document.querySelector<HTMLElement>('.resume-page');
    if (!page || !drafts) return;
    const previewTab = window.open('', '_blank');
    if (!previewTab) {
      setStatus('浏览器阻止了新标签页，请允许弹出窗口后重试。');
      return;
    }
    previewTab.document.title = '正在生成 PDF';
    previewTab.document.body.textContent = '正在根据预览生成 PDF…';
    setExporting(true);
    try {
      const title = `${drafts[language].basics.name}-${language}-resume`;
      previewTab.location.href = await createResumePdf(page, title);
      setStatus('PDF 已在新标签页打开。');
    } catch (error) {
      previewTab.close();
      setStatus(error instanceof Error ? error.message : 'PDF 生成失败。');
    } finally {
      setExporting(false);
    }
  };

  if (!authReady || !drafts) {
    return <main className="local-loading"><p>{status}</p></main>;
  }

  if (!session) return <LoginPanel configured={hasSupabaseConfig} onSubmit={signIn} />;

  return (
    <div className="app-container">
      <Toolbar exporting={exporting} language={language} onLanguageChange={setLanguage} onExport={() => void exportPdf()} />
      <div className="main-content">
        <aside className="editor-pane">
          <div className="editor-intro"><p className="eyebrow">RESUME STUDIO</p><h2>编辑简历</h2><p>更改会实时反映在右侧 A4 预览中。</p><div className="content-actions"><button className="btn btn-secondary" disabled={Boolean(errors[language])} onClick={() => void saveLocal()} type="button">保存本地</button><button className="btn btn-primary" disabled={Boolean(errors[language])} onClick={() => void publish()} type="button">发布</button></div><p className={errors[language] ? 'form-error' : 'editor-status'}>{errors[language] ?? status}</p></div>
          <ResumeForm data={drafts[language]} onChange={handleContentChange} onVisibilityChange={setVisibility} visibility={visibility} />
          <details className="visibility-panel"><summary>显示控制</summary><EditorPane data={drafts[language]} onVisibilityChange={setVisibility} visibility={visibility} /></details>
          <button className="sign-out" onClick={() => void supabase?.auth.signOut()} type="button">Sign out</button>
        </aside>
        <div className="preview-stack">
          <PreviewPane balance={balance} data={drafts[language]} language={language} onBalanceChange={setBalance} visibility={visibility} />
        </div>
      </div>
    </div>
  );
}

export default App;
