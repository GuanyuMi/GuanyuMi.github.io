import React from 'react';
import type {
  ResumeData,
  ResumeSectionKey,
  ResumeVisibility,
} from '../types';

interface EditorPaneProps {
  data: ResumeData;
  visibility: ResumeVisibility;
  onVisibilityChange: React.Dispatch<React.SetStateAction<ResumeVisibility>>;
}

const sectionLabels: Record<ResumeSectionKey, string> = {
  education: '教育背景',
  skills: '专业技能',
  experience: '相关经历',
  projects: '个人项目',
};

const itemKey = (section: ResumeSectionKey, index: number) => `${section}.${index}`;
const bulletKey = (section: ResumeSectionKey, itemIndex: number, bulletIndex: number) =>
  `${section}.${itemIndex}.${bulletIndex}`;

const isItemVisible = (
  visibility: ResumeVisibility,
  section: ResumeSectionKey,
  index: number,
) => visibility.items[itemKey(section, index)] ?? true;

const isBulletVisible = (
  visibility: ResumeVisibility,
  section: ResumeSectionKey,
  itemIndex: number,
  bulletIndex: number,
) => visibility.bullets[bulletKey(section, itemIndex, bulletIndex)] ?? true;

const ToggleRow = ({
  checked,
  label,
  detail,
  onChange,
}: {
  checked: boolean;
  label: string;
  detail?: string;
  onChange: (checked: boolean) => void;
}) => (
  <label className="toggle-row">
    <button
      aria-label={checked ? `隐藏${label}` : `显示${label}`}
      className={`eye-toggle ${checked ? 'active' : ''}`}
      onClick={() => onChange(!checked)}
      title={checked ? '隐藏' : '显示'}
      type="button"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {checked ? (
          <>
            <path d="M12 5.5c5.1 0 8.5 4.7 9.4 6.1a.8.8 0 0 1 0 .8c-.9 1.4-4.3 6.1-9.4 6.1s-8.5-4.7-9.4-6.1a.8.8 0 0 1 0-.8c.9-1.4 4.3-6.1 9.4-6.1Zm0 2C8.4 7.5 5.7 10.4 4.4 12c1.3 1.6 4 4.5 7.6 4.5s6.3-2.9 7.6-4.5c-1.3-1.6-4-4.5-7.6-4.5Z" />
            <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
          </>
        ) : (
          <>
            <path d="m4.3 3 16.7 16.7-1.3 1.3-3-3A10.4 10.4 0 0 1 12 19c-5.1 0-8.5-4.7-9.4-6.1a.8.8 0 0 1 0-.8 18.2 18.2 0 0 1 4-4.2L3 4.3 4.3 3Zm3.8 6.4A16 16 0 0 0 4.4 12c1.3 1.6 4 4.5 7.6 4.5 1.2 0 2.3-.3 3.3-.8l-2-2A3 3 0 0 1 10.3 10l-2.2-2.1Z" />
            <path d="M12 5.5c5.1 0 8.5 4.7 9.4 6.1a.8.8 0 0 1 0 .8 15.4 15.4 0 0 1-2.2 2.8l-1.4-1.4c.7-.6 1.3-1.3 1.8-1.8-1.3-1.6-4-4.5-7.6-4.5-.7 0-1.4.1-2.1.3L8.4 6.3c1.1-.5 2.3-.8 3.6-.8Z" />
          </>
        )}
      </svg>
    </button>
    <span>
      <strong>{label}</strong>
      {detail && <small>{detail}</small>}
    </span>
  </label>
);

const getExperienceTitle = (item: ResumeData['experience'][number]) => {
  const organization = item.institution ?? item.company ?? item.name ?? '';
  return organization ? `${item.position} @ ${organization}` : item.position;
};

const EditorPane: React.FC<EditorPaneProps> = ({
  data,
  visibility,
  onVisibilityChange,
}) => {
  const setBasic = (key: keyof ResumeVisibility['basics'], checked: boolean) => {
    onVisibilityChange((current) => ({
      ...current,
      basics: { ...current.basics, [key]: checked },
    }));
  };

  const setSection = (section: ResumeSectionKey, checked: boolean) => {
    onVisibilityChange((current) => ({
      ...current,
      sections: { ...current.sections, [section]: checked },
    }));
  };

  const setItem = (section: ResumeSectionKey, index: number, checked: boolean) => {
    onVisibilityChange((current) => ({
      ...current,
      items: { ...current.items, [itemKey(section, index)]: checked },
    }));
  };

  const setBullet = (
    section: ResumeSectionKey,
    itemIndex: number,
    bulletIndex: number,
    checked: boolean,
  ) => {
    onVisibilityChange((current) => ({
      ...current,
      bullets: {
        ...current.bullets,
        [bulletKey(section, itemIndex, bulletIndex)]: checked,
      },
    }));
  };

  const renderSectionItems = (
    section: ResumeSectionKey,
    items: Array<{ label: string; detail?: string; bullets?: string[] }>,
  ) => (
    <div className="control-group">
      <ToggleRow
        checked={visibility.sections[section]}
        label={sectionLabels[section]}
        onChange={(checked) => setSection(section, checked)}
      />
      {visibility.sections[section] && (
        <div className="nested-controls">
          {items.map((item, index) => (
            <div className="control-item" key={`${section}-${index}`}>
              <ToggleRow
                checked={isItemVisible(visibility, section, index)}
                detail={item.detail}
                label={item.label}
                onChange={(checked) => setItem(section, index, checked)}
              />
              {isItemVisible(visibility, section, index) && item.bullets && (
                <div className="bullet-controls">
                  {item.bullets.map((bullet, bulletIndex) => (
                    <ToggleRow
                      checked={isBulletVisible(visibility, section, index, bulletIndex)}
                      key={`${section}-${index}-${bulletIndex}`}
                      label={bullet}
                      onChange={(checked) =>
                        setBullet(section, index, bulletIndex, checked)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="layout-editor">
      <section className="editor-section">
        <h2 className="editor-section-title">基础信息</h2>
        <ToggleRow
          checked={visibility.basics.role}
          label="求职方向"
          onChange={(checked) => setBasic('role', checked)}
        />
        <ToggleRow
          checked={visibility.basics.field}
          label="研究领域"
          onChange={(checked) => setBasic('field', checked)}
        />
        <ToggleRow
          checked={visibility.basics.contact}
          label="联系方式"
          onChange={(checked) => setBasic('contact', checked)}
        />
        <ToggleRow
          checked={visibility.basics.location}
          label="所在地"
          onChange={(checked) => setBasic('location', checked)}
        />
        <ToggleRow
          checked={visibility.basics.profiles}
          label="社交链接"
          onChange={(checked) => setBasic('profiles', checked)}
        />
        <ToggleRow
          checked={visibility.basics.about}
          label="个人简介"
          onChange={(checked) => setBasic('about', checked)}
        />
        <ToggleRow
          checked={visibility.basics.photo}
          label="照片"
          onChange={(checked) => setBasic('photo', checked)}
        />
      </section>

      <section className="editor-section">
        <h2 className="editor-section-title">简历内容</h2>
        {renderSectionItems(
          'education',
          data.education.map((item) => ({
            label: item.institution,
            detail: `${item.studyType} · ${item.area}`,
            bullets: item.courses,
          })),
        )}
        {renderSectionItems(
          'experience',
          data.experience.map((item) => ({
            label: getExperienceTitle(item),
            detail: `${item.startDate} - ${item.endDate}`,
            bullets: item.description ?? (item.summary ? [item.summary] : []),
          })),
        )}
        {renderSectionItems(
          'projects',
          (data.projects ?? []).map((item) => ({
            label: item.name,
            detail: item.startDate,
            bullets: item.description,
          })),
        )}
        {renderSectionItems(
          'skills',
          data.skills.map((item) => ({
            label: item.category ?? item.name ?? '技能分类',
            detail: item.keywords.join(', '),
            bullets: item.keywords,
          })),
        )}
      </section>
    </div>
  );
};

export default EditorPane;
