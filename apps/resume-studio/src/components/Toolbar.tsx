import React from 'react';

type ResumeLanguage = 'zh' | 'en';

interface ToolbarProps {
  language: ResumeLanguage;
  onLanguageChange: (language: ResumeLanguage) => void;
  onExport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  language,
  onLanguageChange,
  onExport,
}) => {
  return (
    <header className="header">
      <div>
        <h1>Resume Studio</h1>
        <p>简历预览与编辑</p>
      </div>

      <div className="toolbar-actions">
        <div className="segmented-control" aria-label="Resume language">
          <button
            className={language === 'zh' ? 'active' : ''}
            onClick={() => onLanguageChange('zh')}
            type="button"
          >
            中文
          </button>
          <button
            className={language === 'en' ? 'active' : ''}
            onClick={() => onLanguageChange('en')}
            type="button"
          >
            English
          </button>
        </div>
        <button className="btn btn-primary" onClick={onExport} type="button">
          导出 PDF
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
