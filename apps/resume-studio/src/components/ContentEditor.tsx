import type { Locale } from '@portfolio/resume-schema';

interface ContentEditorProps {
  language: Locale;
  value: string;
  error: string | null;
  status: string | null;
  canPublish: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onPublish: () => void;
}

const ContentEditor = ({
  language,
  value,
  error,
  status,
  canPublish,
  onChange,
  onSave,
  onPublish,
}: ContentEditorProps) => (
  <section className="content-editor">
    <div className="content-editor-heading">
      <div>
        <p className="eyebrow">{language === 'zh' ? '中文内容' : 'English content'}</p>
        <h2>Resume JSON</h2>
      </div>
      <div className="content-actions">
        <button className="btn btn-secondary" disabled={!canPublish} onClick={onSave} type="button">Save locally</button>
        <button className="btn btn-primary" disabled={!canPublish} onClick={onPublish} type="button">Publish</button>
      </div>
    </div>
    <textarea aria-label="Resume JSON" onChange={(event) => onChange(event.target.value)} spellCheck={false} value={value} />
    {error ? <p className="form-error" role="alert">{error}</p> : <p className="editor-status">{status ?? 'Valid JSON. Save when you are ready.'}</p>}
  </section>
);

export default ContentEditor;
