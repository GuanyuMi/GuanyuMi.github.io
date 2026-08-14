import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { defaultResumes } from '@portfolio/resume-content';
import { parseResumeData, type Locale, type ResumeData } from '@portfolio/resume-schema';
import ContentEditor from './components/ContentEditor';
import EditorPane from './components/EditorPane';
import LoginPanel from './components/LoginPanel';
import PreviewPane from './components/PreviewPane';
import Toolbar from './components/Toolbar';
import { hasSupabaseConfig, supabase } from './lib/supabase';
import type { ResumeLayout, ResumeVisibility } from './types';

const defaultVisibility: ResumeVisibility = {
  basics: { role: true, field: true, contact: true, location: true, profiles: true, about: false, photo: false },
  sections: { education: true, skills: true, experience: true, projects: true },
  items: {},
  bullets: {},
};

const defaultLayout: ResumeLayout = {
  nameSize: 22,
  sectionTitleSize: 12,
  itemTitleSize: 11,
  bodySize: 10,
  spacingScale: 1,
  accentColor: '#0b1f5b',
};

const visibilityKey = (language: Locale) => `resume-visibility-${language}`;
const layoutKey = (language: Locale) => `resume-layout-${language}`;

const loadStored = <T,>(key: string, fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
};

const toText = (data: ResumeData) => JSON.stringify(data, null, 2);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [language, setLanguage] = useState<Locale>('zh');
  const [drafts, setDrafts] = useState<Record<Locale, ResumeData>>(defaultResumes);
  const [rawDrafts, setRawDrafts] = useState<Record<Locale, string>>({ en: toText(defaultResumes.en), zh: toText(defaultResumes.zh) });
  const [errors, setErrors] = useState<Partial<Record<Locale, string>>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<ResumeVisibility>(() => loadStored(visibilityKey('zh'), defaultVisibility));
  const [layout, setLayout] = useState<ResumeLayout>(() => loadStored(layoutKey('zh'), defaultLayout));

  useEffect(() => {
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setVisibility(loadStored(visibilityKey(language), defaultVisibility));
    setLayout(loadStored(layoutKey(language), defaultLayout));
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(visibilityKey(language), JSON.stringify(visibility));
  }, [language, visibility]);

  useEffect(() => {
    window.localStorage.setItem(layoutKey(language), JSON.stringify(layout));
  }, [language, layout]);

  useEffect(() => {
    if (!session || !supabase) return;

    void supabase.from('resume_drafts').select('locale, content').then(({ data, error }) => {
      if (error) {
        setStatus(error.message);
        return;
      }

      const next = { ...defaultResumes };
      data?.forEach((row) => {
        if (row.locale !== 'en' && row.locale !== 'zh') return;
        const locale: Locale = row.locale === 'en' ? 'en' : 'zh';
        const result = parseResumeData(row.content);
        if (result.success) next[locale] = result.data;
      });
      setDrafts(next);
      setRawDrafts({ en: toText(next.en), zh: toText(next.zh) });
      setStatus(data?.length ? 'Drafts loaded.' : 'No cloud drafts yet. Save to initialize them.');
    });
  }, [session]);

  const handleContentChange = (value: string) => {
    setRawDrafts((current) => ({ ...current, [language]: value }));
    try {
      const result = parseResumeData(JSON.parse(value));
      if (!result.success) {
        setErrors((current) => ({ ...current, [language]: result.error.issues[0]?.message ?? 'Resume data is invalid.' }));
        return;
      }
      setDrafts((current) => ({ ...current, [language]: result.data }));
      setErrors((current) => ({ ...current, [language]: undefined }));
    } catch {
      setErrors((current) => ({ ...current, [language]: 'JSON is not valid yet.' }));
    }
  };

  const saveDraft = async (): Promise<boolean> => {
    if (!supabase || !session || errors[language]) return false;
    setStatus('Saving draft…');
    const { error } = await supabase
      .from('resume_drafts')
      .upsert({ locale: language, content: drafts[language], updated_at: new Date().toISOString() });
    setStatus(error ? error.message : 'Draft saved.');
    return !error;
  };

  const publish = async () => {
    const saved = await saveDraft();
    if (!saved || !supabase || errors[language]) return;
    setStatus('Publishing…');
    const { error } = await supabase.rpc('publish_resume', { target_locale: language });
    setStatus(error ? error.message : 'Published. Refresh the portfolio to see the change.');
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Supabase is not configured.';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  if (!session) return <LoginPanel configured={hasSupabaseConfig} onSubmit={signIn} />;

  return (
    <div className="app-container">
      <Toolbar language={language} onLanguageChange={setLanguage} onExport={() => window.print()} />
      <div className="main-content">
        <aside className="editor-pane">
          <ContentEditor canPublish={!errors[language]} error={errors[language] ?? null} language={language} onChange={handleContentChange} onPublish={() => void publish()} onSave={() => void saveDraft()} status={status} value={rawDrafts[language]} />
          <EditorPane data={drafts[language]} layout={layout} onLayoutChange={setLayout} onVisibilityChange={setVisibility} visibility={visibility} />
          <button className="sign-out" onClick={() => void supabase?.auth.signOut()} type="button">Sign out</button>
        </aside>
        <div className="preview-stack">
          <PreviewPane data={drafts[language]} layout={layout} language={language} visibility={visibility} />
        </div>
      </div>
    </div>
  );
}

export default App;
