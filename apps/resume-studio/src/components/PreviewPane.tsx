import React, { useLayoutEffect, useRef, useState } from 'react';
import type {
  ResumeBalance,
  ResumeData,
  ResumeSectionKey,
  ResumeVisibility,
} from '../types';

interface PreviewPaneProps {
  balance: ResumeBalance;
  data: ResumeData;
  visibility: ResumeVisibility;
  language: 'zh' | 'en';
  onBalanceChange: React.Dispatch<React.SetStateAction<ResumeBalance>>;
}

const sectionText = {
  zh: {
    education: '教育背景',
    skills: '专业技能',
    experience: '相关经历',
    projects: '个人项目',
    present: '现在',
    supervisor: '导师',
    coursework: '相关课程',
  },
  en: {
    education: 'Education',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    present: 'Present',
    supervisor: 'Supervisor',
    coursework: 'Coursework',
  },
};

const ContactIcon = ({ type }: { type: 'email' | 'website' | 'linkedin' }) => {
  if (type === 'linkedin') {
    return (
      <svg aria-hidden="true" className="contact-icon" viewBox="0 0 24 24">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.1 20.45H3.54V8.98H7.1v11.47Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="contact-icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {type === 'email' ? (
        <>
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-8.97 5.7a1.9 1.9 0 0 1-2.06 0L2 7" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
        </>
      )}
    </svg>
  );
};

const strongTerms = [
  'Search-R1',
  'MuSiQue',
  '4B',
  'Agentic LLM',
  'Gemini API',
  'Golden trajectories',
  'SFT',
  'Exact Match',
  '2.7',
  'pass@k',
  'Scaling Laws',
  'veRL',
  'RL',
  'C++',
  'PyQt',
  'LangGraph',
  'FastAPI',
  'SQLite',
  'scikit-learn',
  'Forgetting-curve',
  'Unsloth',
  'LoRA',
  'TRL',
  'vLLM',
  'Zod',
  'Supabase Auth',
  'PostgreSQL RLS',
  'GitHub Pages',
];

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

const formatDate = (date: string | undefined, presentLabel: string) => {
  if (!date) {
    return '';
  }

  if (/present|now|current/i.test(date) || date === '至今') {
    return presentLabel;
  }

  return date.replace('-', '.');
};

const formatRange = (startDate: string, endDate: string, presentLabel: string) => {
  const start = formatDate(startDate, presentLabel);
  const end = formatDate(endDate, presentLabel);
  return [start, end].filter(Boolean).join(' - ');
};

const formatAge = (birth: string | undefined) => {
  if (!birth) {
    return undefined;
  }

  const match = birth.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return undefined;
  }

  const today = new Date();
  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  let age = today.getFullYear() - birthYear;

  if (
    today.getMonth() + 1 < birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
  ) {
    age -= 1;
  }

  return age >= 0 ? `${age}岁` : undefined;
};

const emphasize = (text: string) => {
  const pattern = new RegExp(
    `(${strongTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g',
  );

  return text.split(pattern).map((part, index) =>
    strongTerms.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  );
};

const SectionIcon = ({ name }: { name: ResumeSectionKey }) => {
  if (name === 'skills') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 7.5a6.5 6.5 0 0 1-8.1 6.3L6.1 20.6a2 2 0 0 1-2.8 0 2 2 0 0 1 0-2.8l6.8-6.8A6.5 6.5 0 0 1 18.5 3l-4 4 2.5 2.5 4-4c0 .7 0 1.3 0 2Z" />
      </svg>
    );
  }

  if (name === 'experience') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 6V4h6v2h5v14H4V6h5Zm2 0h2V5h-2v1ZM4 11h16v2H4v-2Z" />
      </svg>
    );
  }

  if (name === 'projects') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 17-5-5 5-5 1.7 1.7L6.4 12l3.3 3.3L8 17Zm8 0-1.7-1.7 3.3-3.3-3.3-3.3L16 7l5 5-5 5Zm-5.2 2H8.5l4.7-14h2.3l-4.7 14Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 10 5-10 5L2 8l10-5Zm6 8.2V16c0 2-2.7 4-6 4s-6-2-6-4v-4.8l6 3 6-3Z" />
    </svg>
  );
};

const GithubMark = () => (
  <svg className="inline-icon" viewBox="0 0 19 19" aria-hidden="true">
    <path
      clipRule="evenodd"
      d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const ResumeSection = ({
  title,
  name,
  children,
}: {
  title: string;
  name: ResumeSectionKey;
  children: React.ReactNode;
}) => (
  <section className={`resume-section resume-section-${name}`}>
    <div className="resume-section-heading">
      <h2 className="resume-section-title">
        <span className="section-icon">
          <SectionIcon name={name} />
        </span>
        {title}
      </h2>
      <div className="section-rule" />
    </div>
    {children}
  </section>
);

const MAX_SPACING = 12;
const MIN_ADJUSTMENT = -12;
const FONT_REDUCTION_PER_STEP = 1 / 8;

const getBalanceValues = (adjustment: number) => {
  const spacing = Math.max(0, adjustment);
  const fontReduction = Math.max(0, -adjustment) * FONT_REDUCTION_PER_STEP;

  return {
    spacing,
    nameSize: 22,
    sectionTitleSize: Math.max(10.5, 12 - fontReduction),
    itemTitleSize: Math.max(9, 10.5 - fontReduction),
    bodySize: Math.max(8.5, 10 - fontReduction),
  };
};

const applyBalance = (page: HTMLElement, adjustment: number) => {
  const { spacing, nameSize, sectionTitleSize, itemTitleSize, bodySize } = getBalanceValues(adjustment);
  page.style.setProperty('--resume-spacing-unit', `${spacing}px`);
  page.style.setProperty('--resume-item-gap', `${spacing * 1.5}px`);
  page.style.setProperty('--resume-section-gap', `${spacing * 2}px`);
  page.style.setProperty('--resume-list-line-height', `${1.32 + spacing / 48}`);
  page.style.setProperty('--resume-body-line-height', `${1.45 + spacing / 48}`);
  page.style.setProperty('--resume-name-size', `${nameSize}pt`);
  page.style.setProperty('--resume-section-title-size', `${sectionTitleSize}pt`);
  page.style.setProperty('--resume-item-title-size', `${itemTitleSize}pt`);
  page.style.setProperty('--resume-body-size', `${bodySize}pt`);
};

const PreviewPane: React.FC<PreviewPaneProps> = ({
  balance,
  data,
  visibility,
  language,
  onBalanceChange,
}) => {
  const pageRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [autoAdjustment, setAutoAdjustment] = useState(0);
  const labels = sectionText[language];
  const visibleEducation = data.education.filter((_, index) =>
    isItemVisible(visibility, 'education', index),
  );
  const visibleSkills = data.skills.filter((_, index) =>
    isItemVisible(visibility, 'skills', index),
  );
  const visibleExperience = data.experience.filter((_, index) =>
    isItemVisible(visibility, 'experience', index),
  );
  const visibleProjects = (data.projects ?? []).filter((_, index) =>
    isItemVisible(visibility, 'projects', index),
  );
  const about = data.basics.about ?? data.basics.summary;
  const githubProfile = data.basics.profiles.find(
    (profile) => profile.network.toLowerCase() === 'github',
  );
  const linkedinProfile = data.basics.profiles.find(
    (profile) => profile.network.toLowerCase() === 'linkedin',
  );
  const chineseInfoLine = [
    data.basics.gender,
    formatAge(data.basics.birth),
    visibility.basics.role ? data.basics.role : undefined,
  ].filter(Boolean);
  const effectiveAdjustment = balance.auto ? autoAdjustment : balance.adjustment;
  const balanceValues = getBalanceValues(effectiveAdjustment);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) {
      setAutoAdjustment(0);
      return;
    }
    if (!balance.auto) {
      return;
    }
    let cancelled = false;
    const measure = () => {
      applyBalance(page, 0);
      const styles = window.getComputedStyle(page);
      const naturalHeight = content.getBoundingClientRect().height;
      const availableHeight = page.clientHeight - Number.parseFloat(styles.paddingTop) - Number.parseFloat(styles.paddingBottom);

      if (naturalHeight > availableHeight) {
        let fittingAdjustment = MIN_ADJUSTMENT;
        let overflowingAdjustment = 0;

        applyBalance(page, fittingAdjustment);
        if (content.getBoundingClientRect().height <= availableHeight) {
          for (let index = 0; index < 12; index += 1) {
            const candidate = (fittingAdjustment + overflowingAdjustment) / 2;
            applyBalance(page, candidate);
            if (content.getBoundingClientRect().height <= availableHeight) {
              fittingAdjustment = candidate;
            } else {
              overflowingAdjustment = candidate;
            }
          }
        }

        const nextAdjustment = fittingAdjustment;
        applyBalance(page, nextAdjustment);
        if (!cancelled) setAutoAdjustment(nextAdjustment);
        return;
      }

      let fittingAdjustment = 0;
      let overflowingAdjustment = MAX_SPACING;
      applyBalance(page, overflowingAdjustment);
      if (content.getBoundingClientRect().height <= availableHeight) {
        fittingAdjustment = MAX_SPACING;
      } else {
        for (let index = 0; index < 12; index += 1) {
          const candidate = (fittingAdjustment + overflowingAdjustment) / 2;
          applyBalance(page, candidate);
          if (content.getBoundingClientRect().height <= availableHeight) {
            fittingAdjustment = candidate;
          } else {
            overflowingAdjustment = candidate;
          }
        }
      }

      if (!cancelled) {
        applyBalance(page, fittingAdjustment);
        setAutoAdjustment(fittingAdjustment);
      }
    };
    void document.fonts.ready.then(measure);
    return () => { cancelled = true; };
  }, [balance.auto, data, language, visibility]);

  return (
    <main className="preview-pane">
      <div className="preview-scroll">
        <div className="resume-pages">
        <article
          className={`resume-page resume-page-${language}`}
          ref={pageRef}
          style={{
            '--resume-spacing-unit': `${balanceValues.spacing}px`,
            '--resume-item-gap': `${balanceValues.spacing * 1.5}px`,
            '--resume-section-gap': `${balanceValues.spacing * 2}px`,
            '--resume-list-line-height': `${1.32 + balanceValues.spacing / 48}`,
            '--resume-body-line-height': `${1.45 + balanceValues.spacing / 48}`,
            '--resume-name-size': `${balanceValues.nameSize}pt`,
            '--resume-section-title-size': `${balanceValues.sectionTitleSize}pt`,
            '--resume-item-title-size': `${balanceValues.itemTitleSize}pt`,
            '--resume-body-size': `${balanceValues.bodySize}pt`,
          } as React.CSSProperties}
        >
        <div className="resume-content" ref={contentRef}>
          <header className="resume-header">
            <div className="resume-identity">
              <div>
                <h1>{data.basics.name}</h1>
                {language === 'zh' ? (
                  <div className="resume-basic-lines">
                    {chineseInfoLine.length > 0 && (
                      <p className="resume-basic-line">{chineseInfoLine.join(' | ')}</p>
                    )}
                    {visibility.basics.contact && (
                      <p className="resume-basic-line">
                        {data.basics.email && (
                          <span>
                            邮箱：
                            {data.basics.email}
                          </span>
                        )}
                      </p>
                    )}
                    {visibility.basics.contact && (
                      <p className="resume-basic-line">
                        {data.basics['personal-website'] && (
                          <a href={data.basics['personal-website']}>
                            个人网站：
                            {data.basics['personal-website'].replace(/^https?:\/\//, '')}
                          </a>
                        )}
                        {visibility.basics.profiles && githubProfile && (
                          <a href={githubProfile.url}>
                            Github：
                            {githubProfile.url.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
              {visibility.basics.photo && data.basics.image && (
                <img alt="" className="resume-photo" src={`/${data.basics.image}`} />
              )}
            </div>

            {language === 'en' && visibility.basics.contact && (
              <div className="resume-contact resume-contact-en">
                {data.basics.email && (
                  <a href={`mailto:${data.basics.email}`}>
                    <ContactIcon type="email" />
                    {data.basics.email}
                  </a>
                )}
                <div className="resume-contact-secondary">
                  {data.basics['personal-website'] && (
                    <a href={data.basics['personal-website']}>
                      <ContactIcon type="website" />
                      {data.basics['personal-website']}
                    </a>
                  )}
                  {visibility.basics.profiles && linkedinProfile && (
                    <a href={linkedinProfile.url}>
                      <ContactIcon type="linkedin" />
                      {linkedinProfile.url}
                    </a>
                  )}
                </div>
              </div>
            )}

            {visibility.basics.about && about && <p className="resume-about">{about}</p>}
          </header>

          {visibility.sections.education && visibleEducation.length > 0 && (
            <ResumeSection name="education" title={labels.education}>
              {visibleEducation.map((item, index) => {
                const originalIndex = data.education.indexOf(item);
                const visibleCourses = item.courses.filter((_, courseIndex) =>
                  isBulletVisible(visibility, 'education', originalIndex, courseIndex),
                );
                const degree = [item.studyType, item.area].filter(Boolean).join(' · ');

                return (
                  <div
                    className="resume-item education-item"
                    key={`${item.institution}-${index}`}
                  >
                    {language === 'en' ? (
                      <>
                        <div className="resume-item-header education-header-en">
                          <h3>{item.institution}</h3>
                          <span>{formatRange(item.startDate, item.endDate, labels.present)}</span>
                        </div>
                        <p className="education-degree-en">{degree}</p>
                      </>
                    ) : (
                      <div className="resume-item-header">
                        <h3>
                          <span className="organization-name">{item.institution}</span>
                        </h3>
                        <span className="education-degree">{degree}</span>
                        <span>{formatRange(item.startDate, item.endDate, labels.present)}</span>
                      </div>
                    )}
                    {visibleCourses.length > 0 && (
                      <p className="course-line">
                        <strong>{labels.coursework}：</strong>
                        {visibleCourses.join('，')}
                      </p>
                    )}
                  </div>
                );
              })}
            </ResumeSection>
          )}

          {visibility.sections.experience && visibleExperience.length > 0 && (
            <ResumeSection name="experience" title={labels.experience}>
              {visibleExperience.map((item, index) => {
                const originalIndex = data.experience.indexOf(item);
                const organization = item.institution ?? item.company ?? item.name;
                const organizationLabel = [
                  organization,
                  item.facility,
                  item.supervisor
                    ? language === 'zh'
                      ? `导师：${item.supervisor}`
                      : `${labels.supervisor}: ${item.supervisor}`
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(' · ');
                const description = item.description ?? [];

                return (
                  <div
                    className={`resume-item ${
                      language === 'zh' ? 'experience-item-zh' : ''
                    }`}
                    key={`${item.position}-${index}`}
                  >
                    <div className="resume-item-header">
                      <h3>{organizationLabel}</h3>
                      <div className="experience-meta">
                        <span className="experience-role">{item.position}</span>
                        <span>{formatRange(item.startDate, item.endDate, labels.present)}</span>
                      </div>
                    </div>
                    {item.summary && (
                      <p className="experience-summary">
                        {language === 'zh' && <strong>背景介绍：</strong>}
                        {item.summary}
                      </p>
                    )}
                    <ul className="resume-list">
                      {description.map((text, bulletIndex) =>
                        isBulletVisible(
                          visibility,
                          'experience',
                          originalIndex,
                          bulletIndex,
                        ) ? <li key={`${text}-${bulletIndex}`}>{emphasize(text)}</li> : null,
                      )}
                    </ul>
                  </div>
                );
              })}
            </ResumeSection>
          )}

          {visibility.sections.projects && visibleProjects.length > 0 && (
            <ResumeSection name="projects" title={labels.projects}>
              {visibleProjects.map((item, index) => {
                const originalIndex = (data.projects ?? []).indexOf(item);

                return (
                  <div className="resume-item project-item" key={`${item.name}-${index}`}>
                    <div className="resume-item-header">
                      <h3>{item.name}</h3>
                      <span>{formatDate(item.startDate, labels.present)}</span>
                    </div>
                    {item.link && (
                      <a className="project-link" href={item.link}>
                        <GithubMark />
                        {item.link}
                      </a>
                    )}
                    <div className="project-description">
                      {(item.description ?? []).map((text, bulletIndex) =>
                        isBulletVisible(
                          visibility,
                          'projects',
                          originalIndex,
                          bulletIndex,
                        ) ? (
                          <p className="project-description-row" key={`${text}-${bulletIndex}`}>
                            {bulletIndex < 2 && (
                              <strong className="project-description-label">
                                {language === 'zh'
                                  ? bulletIndex === 0
                                    ? '背景介绍：'
                                    : '技术实现：'
                                  : bulletIndex === 0
                                    ? 'Background: '
                                    : 'Implementation: '}
                              </strong>
                            )}
                            <span>{emphasize(text)}</span>
                          </p>
                        ) : null,
                      )}
                    </div>
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="tag-list">
                        {item.highlights.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </ResumeSection>
          )}
          {visibility.sections.skills && visibleSkills.length > 0 && (
            <ResumeSection name="skills" title={labels.skills}>
              <ul className="skills-list">
                {visibleSkills.map((skill, index) => {
                  const originalIndex = data.skills.indexOf(skill);
                  const visibleKeywords = skill.keywords.filter((_, keywordIndex) =>
                    isBulletVisible(visibility, 'skills', originalIndex, keywordIndex),
                  );

                  if (visibleKeywords.length === 0) {
                    return null;
                  }

                  return (
                    <li className="skill-category" key={`${skill.category}-${index}`}>
                      <strong>{skill.category ?? skill.name}：</strong>
                      <span>{visibleKeywords.join(', ')}</span>
                    </li>
                  );
                })}
              </ul>
            </ResumeSection>
          )}
          </div>
          </article>
        </div>
      </div>
      <div className="preview-balance-bar">
        <label className="preview-auto-toggle"><input checked={balance.auto} onChange={(event) => onBalanceChange({ auto: event.target.checked, adjustment: event.target.checked ? balance.adjustment : effectiveAdjustment })} type="checkbox" /><span>自动</span></label>
        <span aria-hidden="true" title="向左缩小字体">−</span>
        <input aria-label="页面填充微调：向左缩小字体，向右增加间距" className="preview-spacing-range" max={MAX_SPACING} min={MIN_ADJUSTMENT} onChange={(event) => onBalanceChange({ auto: false, adjustment: Number(event.target.value) })} step="0.5" type="range" value={effectiveAdjustment} />
        <span aria-hidden="true" title="向右增加间距">+</span>
        <output className="preview-spacing-value">{effectiveAdjustment < 0 ? `正文 ${balanceValues.bodySize.toFixed(1)}pt` : effectiveAdjustment === 0 ? '0px' : `+${effectiveAdjustment.toFixed(1)}px`}</output>
        <button aria-label="恢复自动平衡" className="preview-balance-reset" onClick={() => onBalanceChange({ auto: true, adjustment: 0 })} title="恢复自动平衡" type="button">↺</button>
      </div>
    </main>
  );
};

export default PreviewPane;
