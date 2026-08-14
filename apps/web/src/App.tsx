/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Box,
  Brain,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Sun,
  Terminal,
  Twitter,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { defaultResumes } from '@portfolio/resume-content';
import type { Locale, ResumeData } from '@portfolio/resume-schema';
import { loadPublishedResume } from './lib/resumes';
import { ExperienceItem, ProjectItem } from './types/resume';
import lightBackground from '../assets/background.png';
import photoImg from '../assets/photo.png';
import resumeEnPdf from '../assets/resume.pdf';
import resumeZhPdf from '../assets/resume-ch.pdf';

type Language = Locale;

type Labels = {
  about: string;
  connect: string;
  degreeJoiner: string;
  education: string;
  experience: string;
  footer: string;
  location: string;
  message: string;
  profileAlt: string;
  projects: string;
  resumePdf: string;
  school: string;
  skills: string;
  status: string;
  switchLanguage: string;
  switchLanguageShort: string;
  switchTheme: string;
  viewAll: string;
};

type ThemeClasses = {
  body: string;
  cardTitle: string;
  muted: string;
  panel: string;
  primary: string;
  secondary: string;
  tag: string;
};

const RESUME_PDFS: Record<Language, string> = {
  en: resumeEnPdf,
  zh: resumeZhPdf,
};

const LABELS: Record<Language, Labels> = {
  en: {
    about: 'About',
    connect: 'Connect',
    degreeJoiner: ' in ',
    education: 'Education',
    experience: 'Experience',
    footer: 'All rights reserved. Built with TypeScript and React.',
    location: 'Location',
    message: 'Message',
    profileAlt: 'Profile photo',
    projects: 'Projects',
    resumePdf: 'View Resume PDF',
    school: 'School',
    skills: 'Skills',
    status: 'Current Status',
    switchLanguage: 'Switch to Chinese',
    switchLanguageShort: '中',
    switchTheme: 'Toggle theme',
    viewAll: 'View All',
  },
  zh: {
    about: '关于我',
    connect: '联系',
    degreeJoiner: ' / ',
    education: '教育经历',
    experience: '经历',
    footer: '保留所有权利。使用 TypeScript 和 React 构建。',
    location: '所在地',
    message: '发送邮件',
    profileAlt: '头像',
    projects: '项目',
    resumePdf: '查看中文简历 PDF',
    school: '学校',
    skills: '技能',
    status: '当前状态',
    switchLanguage: '切换到英文',
    switchLanguageShort: 'EN',
    switchTheme: '切换主题',
    viewAll: '查看全部',
  },
};

const EXPERIENCE_TYPES: Record<Language, Record<string, string>> = {
  en: {
    Internship: 'Internship',
    Research: 'Research',
  },
  zh: {
    Internship: '实习',
    Research: '科研',
  },
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const getTheme = (isDarkMode: boolean): ThemeClasses => ({
  body: isDarkMode ? 'text-slate-300' : 'text-slate-600',
  cardTitle: isDarkMode ? 'text-white' : 'text-slate-800',
  muted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  panel: isDarkMode
    ? 'bg-white/5 border-white/10 hover:bg-white/10'
    : 'bg-white/20 border-white/30 hover:bg-white/30',
  primary: isDarkMode ? 'text-white' : 'text-slate-900',
  secondary: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  tag: isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200/50 text-slate-600',
});

const getNetworkIcon = (network: string): LucideIcon => {
  const net = network.toLowerCase();
  if (net === 'github') return Github;
  if (net === 'twitter') return Twitter;
  if (net === 'linkedin') return Linkedin;
  return Globe;
};

const getNetworkColor = (network: string) => {
  const net = network.toLowerCase();
  if (net === 'twitter') return 'bg-blue-400';
  if (net === 'linkedin') return 'bg-blue-700';
  return 'bg-slate-900';
};

const getSkillIcon = (skillName: string): LucideIcon => {
  const name = skillName.toLowerCase();
  if (name.includes('python') || name.includes('linux')) return Terminal;
  if (name.includes('c/c++') || name.includes('javascript') || name.includes('typescript')) return Code2;
  if (name.includes('pytorch') || name.includes('tensorflow') || name.includes('cuda')) return Cpu;
  if (name.includes('scikit-learn') || name.includes('numpy') || name.includes('pandas')) return Zap;
  if (name.includes('vllm') || name.includes('sql')) return Database;
  if (name.includes('docker') || name.includes('git')) return Box;
  if (name.includes('openai') || name.includes('langchain')) return Brain;
  return Layers;
};

const getProfileImage = (resume: ResumeData) => {
  const image = resume.basics.image;
  if (!image || image.startsWith('assets/') || image.includes('photo.png') || image.includes('my_photo.png')) {
    return photoImg;
  }
  return image;
};

const getExperienceType = (type: string, language: Language) =>
  EXPERIENCE_TYPES[language][type] ?? type;

const GlassCard = ({
  children,
  className,
  delay = 0,
  isDarkMode,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  isDarkMode: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    className={cn(isDarkMode ? 'glass-dark' : 'glass', 'rounded-ios p-6 ios-shadow', className)}
  >
    {children}
  </motion.div>
);

const TimelineItem = ({
  item,
  isDarkMode,
  language,
}: {
  item: ExperienceItem;
  isDarkMode: boolean;
  language: Language;
}) => {
  const theme = getTheme(isDarkMode);
  const isResearch = item.type?.toLowerCase() === 'research';
  const organization = item.institution ?? item.company ?? '';

  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-200/50" />
      <div
        className={cn(
          'absolute left-0 top-1.5 z-10 h-6 w-6 rounded-full border-4 border-white shadow-sm',
          isResearch ? 'bg-indigo-500' : 'bg-teal-500',
        )}
      />

      <div className="flex flex-col">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h4 className={cn('text-sm font-bold', theme.cardTitle)}>{item.position}</h4>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
              isResearch ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600',
            )}
          >
            {getExperienceType(item.type ?? '', language)}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className={theme.muted}>{organization}</span>
          <span className="text-slate-300">•</span>
          <span className={theme.muted}>{item.startDate} - {item.endDate}</span>
        </div>
        <div className="space-y-1">
          {(item.description ?? (item.summary ? [item.summary] : [])).map((description) => (
            <p key={description} className={cn('text-xs leading-relaxed', theme.body)}>
              • {description}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({
  project,
  isDarkMode,
}: {
  project: ProjectItem;
  isDarkMode: boolean;
}) => {
  const theme = getTheme(isDarkMode);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-ios-sm border p-5 shadow-sm transition-all hover:bg-white/30',
        isDarkMode ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/20 border-white/40 hover:bg-white/30',
      )}
    >
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`View ${project.name}`}
      />
      <div className="mb-3 flex items-start justify-between">
        <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600">
          <Terminal size={20} />
        </div>
        <ExternalLink size={16} className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className={cn('mb-4 font-semibold', theme.cardTitle)}>{project.name}</h3>
      <div className="mt-auto flex flex-wrap gap-2">
        {(project.highlights ?? []).map((tag) => (
          <span key={tag} className={cn('rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wider', theme.tag)}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const DockButton = ({
  children,
  isDarkMode,
  title,
  onClick,
}: {
  children: ReactNode;
  isDarkMode: boolean;
  title: string;
  onClick: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.1 }}
    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-sm transition-colors hover:bg-white/40"
    title={title}
    aria-label={title}
  >
    <span className={cn('flex items-center justify-center', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
      {children}
    </span>
  </motion.button>
);

const DockLink = ({
  href,
  icon: Icon,
  isDarkMode,
  title,
}: {
  href: string;
  icon: LucideIcon;
  isDarkMode: boolean;
  title: string;
}) => (
  <motion.a
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
    whileHover={{ y: -4, scale: 1.1 }}
    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-sm transition-colors hover:bg-white/40"
    title={title}
    aria-label={title}
  >
    <Icon size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-700'} />
  </motion.a>
);

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [resumes, setResumes] = useState<Record<Language, ResumeData>>(defaultResumes);

  useEffect(() => {
    void Promise.all((['en', 'zh'] as const).map(loadPublishedResume)).then(([en, zh]) => {
      setResumes({ en: en ?? defaultResumes.en, zh: zh ?? defaultResumes.zh });
    });
  }, []);

  const resumeData = resumes[language];
  const resumePdf = RESUME_PDFS[language];
  const labels = LABELS[language];
  const theme = getTheme(isDarkMode);
  const profileImage = getProfileImage(resumeData);
  const githubUrl = resumeData.basics.profiles.find((profile) => profile.network.toLowerCase() === 'github')?.url;

  return (
    <div className={cn('min-h-screen transition-colors duration-700', isDarkMode ? 'bg-slate-950' : 'bg-[#f2f2f7]')}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <img
          src={lightBackground}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className={cn('absolute inset-0 transition-colors duration-700', isDarkMode ? 'bg-slate-950/35' : 'bg-white/20')} />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
        <section className="mb-12 gap-8 text-center md:flex md:items-center md:justify-between md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className={cn('mb-4 text-5xl font-bold tracking-tight md:text-7xl', theme.primary)}>
              {resumeData.basics.name}
            </h1>
            <div className={cn('max-w-xl', theme.secondary)}>
              <p className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">{resumeData.basics.role}</p>
              <p className="text-lg font-medium opacity-80 md:text-xl">{resumeData.basics.field}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative mt-8 flex-shrink-0 md:mt-0"
          >
            <div className="ios-shadow h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-2xl md:h-64 md:w-64">
              <img
                src={profileImage}
                alt={`${resumeData.basics.name} ${labels.profileAlt}`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:col-span-1">
            <GlassCard className="flex-grow" isDarkMode={isDarkMode}>
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-br from-violet-600 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-violet-500 hover:to-rose-400 hover:shadow-lg"
              >
                <FileText size={18} className="text-white/90" />
                {labels.resumePdf}
              </a>
              <h2 className={cn('mb-6 text-lg font-bold', theme.cardTitle)}>{labels.status}</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-orange-500/10 p-2 text-orange-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className={cn('mb-0.5 text-xs font-bold uppercase tracking-wider', isDarkMode ? 'text-slate-500' : 'text-slate-400')}>{labels.location}</p>
                    <p className={cn('font-semibold', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                      {resumeData.basics.location.city}, {resumeData.basics.location.region}
                    </p>
                  </div>
                </div>

                {resumeData.education[0] && (
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className={cn('mb-0.5 text-xs font-bold uppercase tracking-wider', isDarkMode ? 'text-slate-500' : 'text-slate-400')}>{labels.school}</p>
                      <p className={cn('line-clamp-2 font-semibold', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                        {resumeData.education[0].institution}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full" delay={0.1} isDarkMode={isDarkMode}>
              <h2 className={cn('mb-4 text-xl font-bold', theme.cardTitle)}>{labels.about}</h2>
              <div className={cn('space-y-4 text-sm leading-relaxed lg:text-base', theme.body)}>
                {(resumeData.basics.about ?? resumeData.basics.summary ?? '').split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-3">
            <GlassCard delay={0.2} isDarkMode={isDarkMode}>
              <h2 className={cn('mb-6 text-xl font-bold', theme.cardTitle)}>{labels.skills}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {resumeData.skills.map((skillGroup) => (
                  <div key={skillGroup.category} className="space-y-3">
                    <h3 className={cn('mb-2 text-sm font-bold uppercase tracking-wider', isDarkMode ? 'text-slate-500' : 'text-slate-800 opacity-60')}>
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.keywords.map((skill) => {
                        const Icon = getSkillIcon(skill);
                        return (
                          <div key={skill} className={cn('flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm', isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/20 border-white/40')}>
                            <Icon size={14} className="text-indigo-600" />
                            <span className={cn('text-xs font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>{skill}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="h-full" delay={0.3} isDarkMode={isDarkMode}>
              <h2 className={cn('mb-6 text-xl font-bold', theme.cardTitle)}>{labels.education}</h2>
              <div className="space-y-6">
                {resumeData.education.map((education) => (
                  <div key={education.institution} className="flex gap-4">
                    <div className="h-fit flex-shrink-0 rounded-2xl bg-purple-500/10 p-3 text-purple-600">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className={cn('text-sm font-bold', theme.cardTitle)}>{education.institution}</h4>
                      <p className={cn('mt-0.5 text-xs', theme.muted)}>
                        {education.studyType}
                        {labels.degreeJoiner}
                        {education.area}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {education.startDate} - {education.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full" delay={0.4} isDarkMode={isDarkMode}>
              <h2 className={cn('mb-8 text-xl font-bold', theme.cardTitle)}>{labels.experience}</h2>
              <div className="space-y-4">
                {resumeData.experience.map((experience) => (
                  <TimelineItem key={`${experience.position}-${experience.startDate}`} item={experience} isDarkMode={isDarkMode} language={language} />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full" delay={0.5} isDarkMode={isDarkMode}>
              <div className="mb-6 flex items-center justify-between">
                <h2 className={cn('text-xl font-bold', theme.cardTitle)}>{labels.projects}</h2>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 text-sm font-semibold text-blue-600 hover:underline"
                    title={labels.viewAll}
                  >
                    {labels.viewAll}
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(resumeData.projects ?? []).map((project) => (
                  <ProjectCard key={project.name} project={project} isDarkMode={isDarkMode} />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="flex h-full flex-col" delay={0.6} isDarkMode={isDarkMode}>
              <h2 className={cn('mb-6 text-lg font-bold', theme.cardTitle)}>{labels.connect}</h2>
              <div className="flex-grow space-y-3">
                {resumeData.basics.profiles.map((profile) => {
                  const Icon = getNetworkIcon(profile.network);

                  return (
                    <a
                      key={profile.network}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn('group relative z-10 flex items-center gap-4 rounded-2xl border p-3 shadow-sm transition-all', theme.panel)}
                    >
                      <div className={cn('rounded-xl p-2 text-white', getNetworkColor(profile.network))}>
                        <Icon size={18} />
                      </div>
                      <span className={cn('font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>{profile.network}</span>
                      <ExternalLink size={14} className="ml-auto text-slate-400 group-hover:text-slate-600" />
                    </a>
                  );
                })}
              </div>
              <a
                href={`mailto:${resumeData.basics.email}`}
                className="relative z-10 mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition-colors hover:bg-slate-800"
              >
                <Mail size={18} />
                {labels.message}
              </a>
            </GlassCard>
          </div>
        </div>

        <footer className="mt-24 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {resumeData.basics.name}. {labels.footer}</p>
        </footer>
      </main>

      <div className="glass fixed top-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-4 rounded-full border border-white/40 px-4 py-3 shadow-xl">
        <div className="flex items-center gap-4">
          <DockButton
            isDarkMode={isDarkMode}
            title={labels.switchLanguage}
            onClick={() => setLanguage((currentLanguage) => (currentLanguage === 'en' ? 'zh' : 'en'))}
          >
            <span className="flex items-center gap-1">
              <Globe size={18} />
              <span className="text-[11px] font-bold leading-none">{labels.switchLanguageShort}</span>
            </span>
          </DockButton>

          <DockButton isDarkMode={isDarkMode} title={labels.switchTheme} onClick={() => setIsDarkMode((enabled) => !enabled)}>
            {isDarkMode ? <Sun size={20} className="text-orange-500" /> : <Moon size={20} className="text-indigo-600" />}
          </DockButton>
        </div>

        <div className="mx-1 h-6 w-[2px] rounded-full bg-slate-400/30 mix-blend-overlay" />

        <div className="flex items-center gap-4">
          {resumeData.basics.profiles.map((profile) => (
            <DockLink
              key={profile.network}
              href={profile.url}
              icon={getNetworkIcon(profile.network)}
              isDarkMode={isDarkMode}
              title={profile.network}
            />
          ))}
          <DockLink href={`mailto:${resumeData.basics.email}`} icon={Mail} isDarkMode={isDarkMode} title={labels.message} />
        </div>
      </div>
    </div>
  );
}
