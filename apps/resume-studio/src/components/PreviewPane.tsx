import React from 'react';
import type {
  ResumeData,
  ResumeLayout,
  ResumeSectionKey,
  ResumeVisibility,
} from '../types';

interface PreviewPaneProps {
  data: ResumeData;
  layout: ResumeLayout;
  visibility: ResumeVisibility;
  language: 'zh' | 'en';
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
    <use href="/icons.svg#github-icon" />
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
  <section className="resume-section">
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

const PreviewPane: React.FC<PreviewPaneProps> = ({
  data,
  layout,
  visibility,
  language,
}) => {
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
  const chineseInfoLine = [
    data.basics.gender,
    formatAge(data.basics.birth),
    visibility.basics.role ? data.basics.role : undefined,
  ].filter(Boolean);

  return (
    <main className="preview-pane">
      <div className="resume-pages">
        <article
          className={`resume-page resume-page-${language}`}
          style={
            {
              '--resume-name-size': `${layout.nameSize}pt`,
              '--resume-section-title-size': `${layout.sectionTitleSize}pt`,
              '--resume-item-title-size': `${layout.itemTitleSize}pt`,
              '--resume-body-size': `${layout.bodySize}pt`,
              '--resume-space-scale': layout.spacingScale,
              '--resume-accent': layout.accentColor,
            } as React.CSSProperties
          }
        >
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
                ) : (
                  <>
                    {visibility.basics.role && data.basics.role && (
                      <p className="resume-role">{data.basics.role}</p>
                    )}
                    {visibility.basics.field && data.basics.field && (
                      <p className="resume-field">{data.basics.field}</p>
                    )}
                  </>
                )}
              </div>
              {visibility.basics.photo && data.basics.image && (
                <img alt="" className="resume-photo" src={`/${data.basics.image}`} />
              )}
            </div>

            {language === 'en' && visibility.basics.contact && (
              <div className="resume-contact">
                {data.basics.email && <span>{data.basics.email}</span>}
                {data.basics['personal-website'] && (
                  <a href={data.basics['personal-website']}>
                    {data.basics['personal-website'].replace(/^https?:\/\//, '')}
                  </a>
                )}
                {visibility.basics.location && data.basics.location && (
                  <span>
                    {data.basics.location.city}, {data.basics.location.region}
                  </span>
                )}
                {visibility.basics.profiles &&
                  data.basics.profiles.map((profile) => (
                    <a href={profile.url} key={profile.url}>
                      {profile.network}
                    </a>
                  ))}
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
                    <div className="resume-item-header">
                      <h3>
                        <span className="organization-name">{item.institution}</span>
                      </h3>
                      <span className="education-degree">{degree}</span>
                      <span>{formatRange(item.startDate, item.endDate, labels.present)}</span>
                    </div>
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
          {visibility.sections.experience && visibleExperience.length > 0 && (
            <ResumeSection name="experience" title={labels.experience}>
              {visibleExperience.map((item, index) => {
                const originalIndex = data.experience.indexOf(item);
                const organization = item.institution ?? item.company ?? item.name;
                const organizationLabel = [
                  organization,
                  item.supervisor
                    ? `（${labels.supervisor}：${item.supervisor}）`
                    : undefined,
                ]
                  .filter(Boolean)
                  .join('');
                const description = item.description ?? (item.summary ? [item.summary] : []);

                return (
                  <div
                    className={`resume-item ${
                      language === 'zh' ? 'experience-item-zh' : ''
                    }`}
                    key={`${item.position}-${index}`}
                  >
                    <div className="resume-item-header">
                      <h3>
                        {item.position}
                        {language !== 'zh' && organization && (
                          <>
                            {' @ '}
                            <span className="organization-name">{organization}</span>
                          </>
                        )}
                        {language !== 'zh' && item.supervisor && (
                          <span className="supervisor-label">
                            （{labels.supervisor}：{item.supervisor}）
                          </span>
                        )}
                      </h3>
                      {language === 'zh' && organizationLabel && (
                        <span className="experience-organization">
                          {organizationLabel}
                        </span>
                      )}
                      <span>{formatRange(item.startDate, item.endDate, labels.present)}</span>
                    </div>
                    {language !== 'zh' && item.facility && (
                      <p className="resume-subtitle">{item.facility}</p>
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
                    <ul className="resume-list">
                      {(item.description ?? []).map((text, bulletIndex) =>
                        isBulletVisible(
                          visibility,
                          'projects',
                          originalIndex,
                          bulletIndex,
                        ) ? <li key={`${text}-${bulletIndex}`}>{emphasize(text)}</li> : null,
                      )}
                    </ul>
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
        </article>
      </div>
    </main>
  );
};

export default PreviewPane;
