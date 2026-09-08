import { Eye, EyeOff } from "lucide-react";
import type { ResumeData, ResumeSectionKey, ResumeVisibility } from "../types";

interface Props {
  data: ResumeData;
  visibility: ResumeVisibility;
  onChange: (data: ResumeData) => void;
  onVisibilityChange: React.Dispatch<React.SetStateAction<ResumeVisibility>>;
}

const keyFor = (section: ResumeSectionKey, index: number) =>
  `${section}.${index}`;
const isVisible = (
  state: ResumeVisibility,
  section: ResumeSectionKey,
  index: number,
) => state.items[keyFor(section, index)] ?? true;
const bulletKeyFor = (
  section: ResumeSectionKey,
  itemIndex: number,
  bulletIndex: number,
) => `${section}.${itemIndex}.${bulletIndex}`;
const isBulletVisible = (
  state: ResumeVisibility,
  section: ResumeSectionKey,
  itemIndex: number,
  bulletIndex: number,
) => state.bullets[bulletKeyFor(section, itemIndex, bulletIndex)] ?? true;
const experienceProjectKeyFor = (experienceIndex: number, projectIndex: number) =>
  `experience.${experienceIndex}.projects.${projectIndex}`;
const experienceProjectBulletKeyFor = (
  experienceIndex: number,
  projectIndex: number,
  bulletIndex: number,
) => `experience.${experienceIndex}.projects.${projectIndex}.${bulletIndex}`;
const isExperienceProjectVisible = (
  state: ResumeVisibility,
  experienceIndex: number,
  projectIndex: number,
) => state.items[experienceProjectKeyFor(experienceIndex, projectIndex)] ?? true;
const isExperienceProjectBulletVisible = (
  state: ResumeVisibility,
  experienceIndex: number,
  projectIndex: number,
  bulletIndex: number,
) =>
  state.bullets[
    experienceProjectBulletKeyFor(experienceIndex, projectIndex, bulletIndex)
  ] ?? true;
const move = <T,>(items: T[], index: number, offset: number) => {
  const next = [...items];
  [next[index], next[index + offset]] = [next[index + offset], next[index]];
  return next;
};

const Field = ({
  label,
  value,
  onChange,
  long = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  long?: boolean;
}) => (
  <label className="form-field">
    <span>{label}</span>
    {long ? (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ) : (
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    )}
  </label>
);

const Controls = ({
  index,
  length,
  remove,
  reorder,
}: {
  index: number;
  length: number;
  remove: () => void;
  reorder: (offset: number) => void;
}) => (
  <div className="item-actions">
    <button
      aria-label="上移"
      disabled={index === 0}
      onClick={() => reorder(-1)}
      type="button"
    >
      ↑
    </button>
    <button
      aria-label="下移"
      disabled={index === length - 1}
      onClick={() => reorder(1)}
      type="button"
    >
      ↓
    </button>
    <button onClick={remove} type="button">
      删除
    </button>
  </div>
);

const VisibilityButton = ({
  visible,
  label,
  onClick,
}: {
  visible: boolean;
  label: string;
  onClick: () => void;
}) => {
  const Icon = visible ? Eye : EyeOff;

  return (
    <button
      aria-label={visible ? `隐藏${label}` : `显示${label}`}
      className={`visibility-action ${visible ? "active" : ""}`}
      onClick={onClick}
      title={visible ? "隐藏" : "显示"}
      type="button"
    >
      <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
    </button>
  );
};

const Bullets = ({
  values,
  onChange,
  isVisible,
  onVisibilityToggle,
  label = "要点",
}: {
  values: string[];
  onChange: (values: string[]) => void;
  isVisible: (index: number) => boolean;
  onVisibilityToggle: (index: number) => void;
  label?: string;
}) => (
  <div className="list-editor">
    {values.map((value, index) => (
      <div className="list-row" key={index}>
        <textarea
          aria-label={`${label}${index + 1}`}
          value={value}
          onChange={(event) =>
            onChange(
              values.map((item, itemIndex) =>
                itemIndex === index ? event.target.value : item,
              ),
            )
          }
        />
        <VisibilityButton
          label={`${label}${index + 1}`}
          onClick={() => onVisibilityToggle(index)}
          visible={isVisible(index)}
        />
        <button
          aria-label={`删除${label}`}
          onClick={() =>
            onChange(values.filter((_, itemIndex) => itemIndex !== index))
          }
          type="button"
        >
          ×
        </button>
      </div>
    ))}
    <button
      className="text-action"
      onClick={() => onChange([...values, ""])}
      type="button"
    >
      + 添加{label}
    </button>
  </div>
);

const ResumeForm = ({
  data,
  visibility,
  onChange,
  onVisibilityChange,
}: Props) => {
  const toggle = (section: ResumeSectionKey, index: number) =>
    onVisibilityChange((current) => ({
      ...current,
      items: {
        ...current.items,
        [keyFor(section, index)]: !isVisible(current, section, index),
      },
    }));
  const toggleSection = (section: ResumeSectionKey) =>
    onVisibilityChange((current) => ({
      ...current,
      sections: { ...current.sections, [section]: !current.sections[section] },
    }));
  const toggleBullet = (
    section: ResumeSectionKey,
    itemIndex: number,
    bulletIndex: number,
  ) =>
    onVisibilityChange((current) => ({
      ...current,
      bullets: {
        ...current.bullets,
        [bulletKeyFor(section, itemIndex, bulletIndex)]: !isBulletVisible(
          current,
          section,
          itemIndex,
          bulletIndex,
        ),
      },
    }));
  const toggleExperienceProject = (
    experienceIndex: number,
    projectIndex: number,
  ) =>
    onVisibilityChange((current) => ({
      ...current,
      items: {
        ...current.items,
        [experienceProjectKeyFor(experienceIndex, projectIndex)]:
          !isExperienceProjectVisible(current, experienceIndex, projectIndex),
      },
    }));
  const toggleExperienceProjectBullet = (
    experienceIndex: number,
    projectIndex: number,
    bulletIndex: number,
  ) =>
    onVisibilityChange((current) => ({
      ...current,
      bullets: {
        ...current.bullets,
        [experienceProjectBulletKeyFor(
          experienceIndex,
          projectIndex,
          bulletIndex,
        )]: !isExperienceProjectBulletVisible(
          current,
          experienceIndex,
          projectIndex,
          bulletIndex,
        ),
      },
    }));
  const changeBasics = (key: keyof ResumeData["basics"], value: string) =>
    onChange({ ...data, basics: { ...data.basics, [key]: value } });

  return (
    <div className="resume-form">
      <section className="form-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTENT</p>
            <h2>基础信息</h2>
          </div>
        </div>
        <div className="field-grid">
          <Field
            label="姓名"
            value={data.basics.name}
            onChange={(value) => changeBasics("name", value)}
          />
          <Field
            label="求职方向"
            value={data.basics.role ?? ""}
            onChange={(value) => changeBasics("role", value)}
          />
          <Field
            label="邮箱"
            value={data.basics.email}
            onChange={(value) => changeBasics("email", value)}
          />
          <Field
            label="个人网站"
            value={data.basics["personal-website"]}
            onChange={(value) => changeBasics("personal-website", value)}
          />
          <Field
            label="研究领域"
            long
            value={data.basics.field ?? ""}
            onChange={(value) => changeBasics("field", value)}
          />
          <Field
            label="个人简介"
            long
            value={data.basics.about ?? ""}
            onChange={(value) => changeBasics("about", value)}
          />
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTENT</p>
            <h2>教育经历</h2>
          </div>
          <VisibilityButton
            label="教育经历区块"
            onClick={() => toggleSection("education")}
            visible={visibility.sections.education}
          />
        </div>
        {data.education.map((item, index) => (
          <div className="form-item" key={index}>
            <div className="item-heading">
              <strong>{item.institution || "未命名教育经历"}</strong>
              <VisibilityButton
                label={item.institution || "教育经历"}
                onClick={() => toggle("education", index)}
                visible={isVisible(visibility, "education", index)}
              />
              <Controls
                index={index}
                length={data.education.length}
                remove={() =>
                  onChange({
                    ...data,
                    education: data.education.filter((_, i) => i !== index),
                  })
                }
                reorder={(offset) =>
                  onChange({
                    ...data,
                    education: move(data.education, index, offset),
                  })
                }
              />
            </div>
            <div className="field-grid">
              <Field
                label="学校"
                value={item.institution}
                onChange={(value) =>
                  onChange({
                    ...data,
                    education: data.education.map((entry, i) =>
                      i === index ? { ...entry, institution: value } : entry,
                    ),
                  })
                }
              />
              <Field
                label="学位"
                value={item.studyType}
                onChange={(value) =>
                  onChange({
                    ...data,
                    education: data.education.map((entry, i) =>
                      i === index ? { ...entry, studyType: value } : entry,
                    ),
                  })
                }
              />
              <Field
                label="专业"
                value={item.area}
                onChange={(value) =>
                  onChange({
                    ...data,
                    education: data.education.map((entry, i) =>
                      i === index ? { ...entry, area: value } : entry,
                    ),
                  })
                }
              />
              <Field
                label="起止时间"
                value={`${item.startDate} - ${item.endDate}`}
                onChange={(value) => {
                  const [startDate = "", endDate = ""] = value.split(" - ");
                  onChange({
                    ...data,
                    education: data.education.map((entry, i) =>
                      i === index ? { ...entry, startDate, endDate } : entry,
                    ),
                  });
                }}
              />
            </div>
            <Bullets
              isVisible={(bulletIndex) =>
                isBulletVisible(visibility, "education", index, bulletIndex)
              }
              label="课程"
              onVisibilityToggle={(bulletIndex) =>
                toggleBullet("education", index, bulletIndex)
              }
              values={item.courses}
              onChange={(courses) =>
                onChange({
                  ...data,
                  education: data.education.map((entry, i) =>
                    i === index ? { ...entry, courses } : entry,
                  ),
                })
              }
            />
          </div>
        ))}
        <button
          className="text-action"
          onClick={() =>
            onChange({
              ...data,
              education: [
                ...data.education,
                {
                  institution: "",
                  location: "",
                  area: "",
                  studyType: "",
                  startDate: "",
                  endDate: "",
                  courses: [],
                },
              ],
            })
          }
          type="button"
        >
          + 添加教育经历
        </button>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTENT</p>
            <h2>相关经历</h2>
          </div>
          <VisibilityButton
            label="相关经历区块"
            onClick={() => toggleSection("experience")}
            visible={visibility.sections.experience}
          />
        </div>
        {data.experience.map((item, index) => (
          <div className="form-item" key={index}>
            <div className="item-heading">
              <strong>{item.position || "未命名经历"}</strong>
              <VisibilityButton
                label={item.position || "相关经历"}
                onClick={() => toggle("experience", index)}
                visible={isVisible(visibility, "experience", index)}
              />
              <Controls
                index={index}
                length={data.experience.length}
                remove={() =>
                  onChange({
                    ...data,
                    experience: data.experience.filter((_, i) => i !== index),
                  })
                }
                reorder={(offset) =>
                  onChange({
                    ...data,
                    experience: move(data.experience, index, offset),
                  })
                }
              />
            </div>
            <div className="field-grid">
              <Field
                label="组织"
                value={item.company ?? item.institution ?? item.name ?? ""}
                onChange={(value) =>
                  onChange({
                    ...data,
                    experience: data.experience.map((entry, i) =>
                      i === index
                        ? { ...entry, company: value, institution: undefined }
                        : entry,
                    ),
                  })
                }
              />
              <Field
                label="职位"
                value={item.position}
                onChange={(value) =>
                  onChange({
                    ...data,
                    experience: data.experience.map((entry, i) =>
                      i === index ? { ...entry, position: value } : entry,
                    ),
                  })
                }
              />
              <Field
                label="开始时间"
                value={item.startDate}
                onChange={(value) =>
                  onChange({
                    ...data,
                    experience: data.experience.map((entry, i) =>
                      i === index ? { ...entry, startDate: value } : entry,
                    ),
                  })
                }
              />
              <Field
                label="结束时间"
                value={item.endDate}
                onChange={(value) =>
                  onChange({
                    ...data,
                    experience: data.experience.map((entry, i) =>
                      i === index ? { ...entry, endDate: value } : entry,
                    ),
                  })
                }
              />
            </div>
            <label className="form-field">
              <span>内容结构</span>
              <select
                value={item.projects === undefined ? "standard" : "projects"}
                onChange={(event) => {
                  const nextMode = event.target.value;
                  if (
                    nextMode === "standard" &&
                    (item.projects?.length ?? 0) > 0 &&
                    !window.confirm("切换后会移除这段经历下的项目，是否继续？")
                  ) {
                    return;
                  }

                  onChange({
                    ...data,
                    experience: data.experience.map((entry, i) => {
                      if (i !== index) return entry;
                      if (nextMode === "projects") {
                        return {
                          ...entry,
                          projects: entry.projects ?? [
                            { name: "", background: "", description: [] },
                          ],
                        };
                      }
                      return { ...entry, projects: undefined };
                    }),
                  });
                }}
              >
                <option value="standard">直接展示经历内容</option>
                <option value="projects">按多个项目展示</option>
              </select>
            </label>
            {item.projects === undefined ? (
              <>
                <Field
                  label="背景介绍"
                  long
                  value={item.background ?? item.summary ?? ""}
                  onChange={(background) =>
                    onChange({
                      ...data,
                      experience: data.experience.map((entry, i) =>
                        i === index
                          ? { ...entry, background, summary: undefined }
                          : entry,
                      ),
                    })
                  }
                />
                <Bullets
                  isVisible={(bulletIndex) =>
                    isBulletVisible(visibility, "experience", index, bulletIndex)
                  }
                  onVisibilityToggle={(bulletIndex) =>
                    toggleBullet("experience", index, bulletIndex)
                  }
                  values={item.description ?? []}
                  onChange={(description) =>
                    onChange({
                      ...data,
                      experience: data.experience.map((entry, i) =>
                        i === index ? { ...entry, description } : entry,
                      ),
                    })
                  }
                />
              </>
            ) : (
              <div className="nested-project-editor">
                {item.projects.map((project, projectIndex) => (
                  <div className="nested-project-item" key={projectIndex}>
                    <div className="item-heading">
                      <strong>{project.name || "未命名项目"}</strong>
                      <VisibilityButton
                        label={project.name || `项目${projectIndex + 1}`}
                        onClick={() =>
                          toggleExperienceProject(index, projectIndex)
                        }
                        visible={isExperienceProjectVisible(
                          visibility,
                          index,
                          projectIndex,
                        )}
                      />
                      <Controls
                        index={projectIndex}
                        length={item.projects?.length ?? 0}
                        remove={() =>
                          onChange({
                            ...data,
                            experience: data.experience.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    projects: (entry.projects ?? []).filter(
                                      (_, p) => p !== projectIndex,
                                    ),
                                  }
                                : entry,
                            ),
                          })
                        }
                        reorder={(offset) =>
                          onChange({
                            ...data,
                            experience: data.experience.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    projects: move(
                                      entry.projects ?? [],
                                      projectIndex,
                                      offset,
                                    ),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </div>
                    <Field
                      label="项目名称"
                      value={project.name}
                      onChange={(name) =>
                        onChange({
                          ...data,
                          experience: data.experience.map((entry, i) =>
                            i === index
                              ? {
                                  ...entry,
                                  projects: (entry.projects ?? []).map(
                                    (candidate, p) =>
                                      p === projectIndex
                                        ? { ...candidate, name }
                                        : candidate,
                                  ),
                                }
                              : entry,
                          ),
                        })
                      }
                    />
                    <Field
                      label="背景介绍"
                      long
                      value={project.background ?? ""}
                      onChange={(background) =>
                        onChange({
                          ...data,
                          experience: data.experience.map((entry, i) =>
                            i === index
                              ? {
                                  ...entry,
                                  projects: (entry.projects ?? []).map(
                                    (candidate, p) =>
                                      p === projectIndex
                                        ? { ...candidate, background }
                                        : candidate,
                                  ),
                                }
                              : entry,
                          ),
                        })
                      }
                    />
                    <Bullets
                      label="项目要点"
                      isVisible={(bulletIndex) =>
                        isExperienceProjectBulletVisible(
                          visibility,
                          index,
                          projectIndex,
                          bulletIndex,
                        )
                      }
                      onVisibilityToggle={(bulletIndex) =>
                        toggleExperienceProjectBullet(
                          index,
                          projectIndex,
                          bulletIndex,
                        )
                      }
                      values={project.description ?? []}
                      onChange={(description) =>
                        onChange({
                          ...data,
                          experience: data.experience.map((entry, i) =>
                            i === index
                              ? {
                                  ...entry,
                                  projects: (entry.projects ?? []).map(
                                    (candidate, p) =>
                                      p === projectIndex
                                        ? { ...candidate, description }
                                        : candidate,
                                  ),
                                }
                              : entry,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  className="text-action"
                  onClick={() =>
                    onChange({
                      ...data,
                      experience: data.experience.map((entry, i) =>
                        i === index
                          ? {
                              ...entry,
                              projects: [
                                ...(entry.projects ?? []),
                                { name: "", background: "", description: [] },
                              ],
                            }
                          : entry,
                      ),
                    })
                  }
                  type="button"
                >
                  + 添加经历项目
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          className="text-action"
          onClick={() =>
            onChange({
              ...data,
              experience: [
                ...data.experience,
                {
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  description: [],
                },
              ],
            })
          }
          type="button"
        >
          + 添加经历
        </button>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTENT</p>
            <h2>技能</h2>
          </div>
          <VisibilityButton
            label="技能区块"
            onClick={() => toggleSection("skills")}
            visible={visibility.sections.skills}
          />
        </div>
        {data.skills.map((item, index) => (
          <div className="form-item compact-item" key={index}>
            <div className="item-heading">
              <strong>{item.category ?? item.name ?? "技能分类"}</strong>
              <VisibilityButton
                label={item.category ?? item.name ?? "技能分类"}
                onClick={() => toggle("skills", index)}
                visible={isVisible(visibility, "skills", index)}
              />
              <Controls
                index={index}
                length={data.skills.length}
                remove={() =>
                  onChange({
                    ...data,
                    skills: data.skills.filter((_, i) => i !== index),
                  })
                }
                reorder={(offset) =>
                  onChange({
                    ...data,
                    skills: move(data.skills, index, offset),
                  })
                }
              />
            </div>
            <Field
              label="分类"
              value={item.category ?? item.name ?? ""}
              onChange={(value) =>
                onChange({
                  ...data,
                  skills: data.skills.map((entry, i) =>
                    i === index ? { ...entry, category: value } : entry,
                  ),
                })
              }
            />
            <Field
              label="关键词（逗号分隔）"
              value={item.keywords.join(", ")}
              onChange={(value) =>
                onChange({
                  ...data,
                  skills: data.skills.map((entry, i) =>
                    i === index
                      ? {
                          ...entry,
                          keywords: value
                            .split(",")
                            .map((word) => word.trim())
                            .filter(Boolean),
                        }
                      : entry,
                  ),
                })
              }
            />
          </div>
        ))}
        <button
          className="text-action"
          onClick={() =>
            onChange({
              ...data,
              skills: [...data.skills, { category: "", keywords: [] }],
            })
          }
          type="button"
        >
          + 添加技能分类
        </button>
      </section>
      <section className="form-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTENT</p>
            <h2>个人项目</h2>
          </div>
          <VisibilityButton
            label="个人项目区块"
            onClick={() => toggleSection("projects")}
            visible={visibility.sections.projects}
          />
        </div>
        {(data.projects ?? []).map((item, index) => (
          <div className="form-item" key={index}>
            <div className="item-heading">
              <strong>{item.name || "未命名项目"}</strong>
              <VisibilityButton
                label={item.name || "个人项目"}
                onClick={() => toggle("projects", index)}
                visible={isVisible(visibility, "projects", index)}
              />
              <Controls
                index={index}
                length={(data.projects ?? []).length}
                remove={() =>
                  onChange({
                    ...data,
                    projects: (data.projects ?? []).filter(
                      (_, i) => i !== index,
                    ),
                  })
                }
                reorder={(offset) =>
                  onChange({
                    ...data,
                    projects: move(data.projects ?? [], index, offset),
                  })
                }
              />
            </div>
            <div className="field-grid">
              <Field
                label="项目名称"
                value={item.name}
                onChange={(value) =>
                  onChange({
                    ...data,
                    projects: (data.projects ?? []).map((entry, i) =>
                      i === index ? { ...entry, name: value } : entry,
                    ),
                  })
                }
              />
              <Field
                label="链接"
                value={item.link ?? ""}
                onChange={(value) =>
                  onChange({
                    ...data,
                    projects: (data.projects ?? []).map((entry, i) =>
                      i === index ? { ...entry, link: value } : entry,
                    ),
                  })
                }
              />
            </div>
            <Bullets
              isVisible={(bulletIndex) =>
                isBulletVisible(visibility, "projects", index, bulletIndex)
              }
              onVisibilityToggle={(bulletIndex) =>
                toggleBullet("projects", index, bulletIndex)
              }
              values={item.description ?? []}
              onChange={(description) =>
                onChange({
                  ...data,
                  projects: (data.projects ?? []).map((entry, i) =>
                    i === index ? { ...entry, description } : entry,
                  ),
                })
              }
            />
          </div>
        ))}
        <button
          className="text-action"
          onClick={() =>
            onChange({
              ...data,
              projects: [
                ...(data.projects ?? []),
                { name: "", description: [] },
              ],
            })
          }
          type="button"
        >
          + 添加项目
        </button>
      </section>
    </div>
  );
};

export default ResumeForm;
