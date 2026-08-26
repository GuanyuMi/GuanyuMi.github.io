import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Bot, Boxes, Braces, Container, Cpu, Database, Github, GitBranch, Linkedin, Mail } from 'lucide-react';
import type { ResumeData } from '@portfolio/resume-schema';
import { loadPublishedResume } from './lib/resumes';

type Project = {
  name: string;
  summary: string;
  link?: string;
};

type Page = 'home' | 'profile';

const GITHUB_PROFILE = 'https://github.com/GuanyuMi';
const SOURCE_REPOSITORY = 'https://github.com/GuanyuMi/GuanyuMi.github.io';

const PROJECT_COPY = [
  {
    summary: 'An adaptive interview system that turns a candidate profile into targeted technical practice.',
  },
  {
    summary: 'A resource-aware reproduction of reasoning training experiments on a single 16GB GPU.',
  },
];

const getPage = (): Page => window.location.hash === '#/profile' ? 'profile' : 'home';

function Header({ name, page = 'home' }: { name?: string; page?: Page }) {
  const brandName = name?.replace(/\s/g, '').toUpperCase() ?? 'GUANYUMI';
  return <header className="site-header">
    {page === 'home'
      ? <a className="system-brand" href="#/"><span className="status-light" />CORE_LINK_ESTABLISHED</a>
      : <a className="profile-brand" href="#/" aria-label="Return to home"><span className="status-light" /><span className="profile-brand-copy"><strong>{brandName}<b>.</b></strong><span>AI_ENGINEER</span></span></a>}
    <div className="system-metrics" aria-hidden="true"><span>LATENCY: <b>14MS</b></span><span>UPTIME: <b>99.98%</b></span></div>
    <nav aria-label="Primary navigation"><a className={page === 'profile' ? 'is-active' : ''} href="#/profile">PROFILE</a></nav>
    <a className="terminal-button" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">ACCESS_TERMINAL</a>
  </header>;
}

function SocialLinks({ resume }: { resume: ResumeData }) {
  const github = resume.basics.profiles.find((profile) => profile.network === 'GitHub')?.url;
  const linkedin = resume.basics.profiles.find((profile) => profile.network === 'LinkedIn')?.url;
  return <div className="social-links">
    {github && <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>}
    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>}
    <a href={`mailto:${resume.basics.email}`} aria-label="Email"><Mail size={18} /></a>
  </div>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  const content = <>
    <div className="project-card-head"><div><p>0{index + 1}_PROJECT</p><h3>{project.name}</h3></div><span><ArrowUpRight size={23} /></span></div>
    {index === 0
      ? <div className="project-art project-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      : <div className="project-art project-orbit" aria-hidden="true"><i /><b /></div>}
    <p className="project-summary">{project.summary}</p>
  </>;
  return <motion.a
    className={`project-card project-card-${index + 1}`}
    href={project.link ?? '#projects'}
    target={project.link ? '_blank' : undefined}
    rel={project.link ? 'noreferrer' : undefined}
    whileHover={reduceMotion ? undefined : { y: -7, rotate: index ? 0.25 : -0.25 }}
    transition={{ duration: .28, ease: 'easeOut' }}
  >{content}</motion.a>;
}

function Footer({ resume }: { resume: ResumeData }) {
  return <footer className="site-footer">
    <div className="footer-main">
      <p>© {new Date().getFullYear()} {resume.basics.name.toUpperCase()} // NO_TRACKING // NO_COOKIES</p>
      <nav aria-label="Footer navigation"><a href={SOURCE_REPOSITORY} target="_blank" rel="noreferrer">SOURCE_CODE</a></nav>
    </div>
  </footer>;
}

function StatusBar() {
  return <div className="footer-status"><p><i />TERMINAL_ID: GM_AI_026</p><p>RAM: 12.4GB/32GB　 TEMP: 42°C　 THREAT_LEVEL: NULL</p></div>;
}

const formatDate = (value: string) => {
  if (value.toLowerCase() === 'present') return 'PRESENT';
  const [year, month] = value.split('-');
  if (!month) return year;
  const monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(Number(year), Number(month) - 1));
  return `${monthName.toUpperCase()} ${year}`;
};

function ProfilePage({ resume }: { resume: ResumeData }) {
  const allSkills = new Set(resume.skills.flatMap((group) => group.keywords));
  const preferredSkills = ['Python', 'C/C++', 'TypeScript', 'LangGraph', 'vLLM', 'PyTorch', 'Docker', 'Linux'].filter((skill) => allSkills.has(skill));
  const skillIcons = [Braces, Cpu, Boxes, Bot, Database, GitBranch, Container, Cpu];

  return <main className="profile-page">
    <div className="profile-layout">
      <section className="history-section">
        <div className="profile-section-heading"><div><p>HISTORY_LOG</p><h1>Professional_Experience</h1></div><span>V2.4_PROFILE</span></div>
        <div className="experience-timeline">
          {resume.experience.map((item, index) => {
            const organization = item.company ?? item.facility ?? item.institution ?? '';
            return <motion.article className="experience-item" key={`${item.position}-${item.startDate}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ delay: index * .06 }}>
              <i className="timeline-node" />
              <div className="experience-title"><div><h2>{item.position}</h2><p>{organization}</p></div><time>{formatDate(item.startDate)} — {formatDate(item.endDate)}</time></div>
              <div className="experience-card">{item.description?.map((description) => <p key={description}>{description}</p>)}</div>
            </motion.article>;
          })}
        </div>
      </section>

      <aside className="profile-sidebar">
        <section className="skill-section">
          <div className="sidebar-heading"><h2>SKILL_MATRIX</h2><i /></div>
          <div className="skill-matrix">{preferredSkills.map((skill, index) => {
            const Icon = skillIcons[index % skillIcons.length];
            return <div className="skill-cell" key={skill}><Icon size={17} /><span>{skill.toUpperCase().replace(/ /g, '_')}</span></div>;
          })}</div>
        </section>
        <section className="education-section">
          <div className="sidebar-heading"><h2>EDUCATION</h2><i /></div>
          <div className="education-cards">{resume.education.map((item) => <article key={`${item.institution}-${item.startDate}`}><p>{item.institution.toUpperCase()} // {item.endDate.slice(0, 4)}</p><h3>{item.studyType} · {item.area}</h3></article>)}</div>
        </section>
      </aside>
    </div>
  </main>;
}

export default function App() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [page, setPage] = useState<Page>(getPage);
  const reduceMotion = useReducedMotion();
  useEffect(() => { void loadPublishedResume('en').then(setResume); }, []);
  useEffect(() => {
    const handleHashChange = () => setPage(getPage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!resume) return <div className="site-frame"><Header page={page} /><main className="loading"><p>CORE_LINK_PENDING</p><h1>Profile unavailable.</h1><span>Published portfolio data could not be loaded.</span></main></div>;

  const parts = resume.basics.name.trim().split(/\s+/);
  const firstName = parts.shift() ?? 'Guanyu';
  const lastName = parts.join(' ') || 'Mi';
  const skills = resume.skills.flatMap((group) => group.keywords).filter((skill) => !skill.includes('API')).slice(0, 6);
  const projects = (resume.projects ?? []).slice(0, 2).map((project, index): Project => ({
    name: project.name,
    link: project.link,
    ...PROJECT_COPY[index % PROJECT_COPY.length],
  }));
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`);
  };

  return <div className="site-frame" id="top" onPointerMove={handlePointerMove}>
    <Header name={resume.basics.name} page={page} />
    {page === 'home' ? <main className="terminal-home">
      <section className="profile-panel" id="profile">
        <motion.div className="profile-content" initial={reduceMotion ? false : 'hidden'} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .09 } } }}>
          <motion.p className="subject-chip" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>SUBJECT_ID: 001_GM</motion.p>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>{firstName}<br />{lastName}<b>.</b></motion.h1>
          <motion.p className="hero-copy" variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>I build agentic systems and machine-learning workflows that turn ambitious research into useful, working software.</motion.p>
          <motion.div className="skill-chips" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>{skills.map((skill) => <span key={skill}>{skill.toUpperCase()}</span>)}</motion.div>
        </motion.div>
        <div className="profile-meta"><p>LOC: CUPERTINO<br />ENV: PRODUCTION_READY</p><SocialLinks resume={resume} /></div>
      </section>

      <section className="work-panel" id="projects">
        <div className="work-heading"><h2>Selected_Work</h2><span>[0{projects.length} PROJECTS]</span></div>
        <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div>
        <motion.section className="availability" initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }}>
          <h2>Ready to build?</h2><span>Open to high-impact AI / ML engineering roles.</span>
          <div><a href={`mailto:${resume.basics.email}`}>SEND_SIGNAL</a></div>
        </motion.section>
        <Footer resume={resume} />
      </section>
    </main> : <ProfilePage resume={resume} />}
    <StatusBar />
  </div>;
}
