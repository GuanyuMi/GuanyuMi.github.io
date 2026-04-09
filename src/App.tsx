/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Code2, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ExternalLink,
  Moon,
  Sun,
  Layers,
  Terminal,
  Zap,
  MapPin,
  GraduationCap,
  Briefcase,
  Box,
  Brain,
  Navigation,
  Shield,
  Database,
  Globe
} from 'lucide-react';

import { ResumeData } from './types/resume';
import resumeDataRaw from '../assets/resume.json';
// Import the photo so Vite can bundle it
import photoImg from '../assets/photo.png';

const resumeData = resumeDataRaw as ResumeData;

// --- Components ---

const GlassCard = ({ children, className = "", delay = 0, isDarkMode = false }: { children: ReactNode, className?: string, delay?: number, isDarkMode?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    className={`${isDarkMode ? 'glass-dark' : 'glass'} rounded-ios p-6 ios-shadow ${className}`}
  >
    {children}
  </motion.div>
);

const TimelineItem = ({ title, company, period, description, type, isDarkMode = false }: { title: string, company: string, period: string, description: string[], type: string, isDarkMode?: boolean }) => {
  const isResearch = type.toLowerCase() === 'research';
  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-200/50" />
      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${
        isResearch ? 'bg-indigo-500' : 'bg-teal-500'
      }`} />
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isResearch ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'
          }`}>
            {type}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          <span className={isDarkMode ? 'text-slate-400' : ''}>{company}</span>
          <span className="text-slate-300">•</span>
          <span className={isDarkMode ? 'text-slate-400' : ''}>{period}</span>
        </div>
        <div className="space-y-1">
          {description.map((desc, i) => (
            <p key={i} className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>• {desc}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ title, description, tags, icon: Icon, link, isDarkMode = false }: any) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`group relative overflow-hidden rounded-ios-sm p-5 border transition-all hover:bg-white/30 shadow-sm h-full flex flex-col ${
      isDarkMode ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/20 border-white/40 hover:bg-white/30'
    }`}
  >
    <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label={`View ${title}`} />
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
        <Icon size={20} />
      </div>
      <ExternalLink size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
    <div className="flex flex-wrap gap-2 mt-auto">
      {tags.map((tag: string) => (
        <span key={tag} className={`text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider ${
          isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200/50 text-slate-600'
        }`}>
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

const getNetworkIcon = (network: string) => {
  const net = network.toLowerCase();
  if (net === 'github') return Github;
  if (net === 'twitter') return Twitter;
  if (net === 'linkedin') return Linkedin;
  return Globe;
};

const getSkillIcon = (skillName: string) => {
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

// --- Main App ---

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Resolve Image
  const profileImage = resumeData.basics.image.includes('photo.png') 
    ? photoImg 
    : (resumeData.basics.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(resumeData.basics.name)}&size=400&background=random`);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? 'bg-slate-950' : 'bg-[#f2f2f7]'}`}>
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 ${isDarkMode ? 'bg-indigo-600/40' : 'bg-blue-400/40'}`} />
        <div className={`absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-[100px] transition-colors duration-1000 ${isDarkMode ? 'bg-purple-600/30' : 'bg-purple-400/30'}`} />
        <div className={`absolute -bottom-24 left-1/3 w-72 h-72 rounded-full blur-[100px] transition-colors duration-1000 ${isDarkMode ? 'bg-blue-600/30' : 'bg-pink-400/30'}`} />
      </div>



      <main className="relative max-w-7xl mx-auto pt-24 pb-32 px-6">
        {/* Header Section */}
        <section className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {resumeData.basics.name}
            </h1>
            <div className={`max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <p className="text-2xl md:text-3xl font-bold italic mb-2 tracking-tight">
                {resumeData.basics.role}
              </p>
              <p className="text-lg md:text-xl font-medium opacity-80">
                {resumeData.basics.field}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8 md:mt-0 relative flex-shrink-0"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl ios-shadow">
              <img 
                src={profileImage}
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Controls + Status */}
          <div className="md:col-span-1 flex flex-col gap-6">

            {/* Current Status Widget */}
            <GlassCard className="flex-grow" isDarkMode={isDarkMode}>
              <h2 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Current Status</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Location</p>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{resumeData.basics.location.city}, {resumeData.basics.location.region}</p>
                  </div>
                </div>

                {resumeData.education.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>School</p>
                      <p className={`font-semibold line-clamp-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{resumeData.education[0].institution}</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: About */}
          <div className="md:col-span-2">
            <GlassCard className="h-full" delay={0.1} isDarkMode={isDarkMode}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>About</h2>
              <div className={`leading-relaxed text-sm lg:text-base space-y-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {resumeData.basics.about.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Full Width Skills */}
          <div className="md:col-span-3">
            <GlassCard delay={0.2} isDarkMode={isDarkMode}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resumeData.skills.map((skillGroup, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-500' : 'opacity-60 text-slate-800'}`}>{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.keywords.map((skill) => {
                        const Icon = getSkillIcon(skill);
                        return (
                          <div key={skill} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
                            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/20 border-white/40'
                          }`}>
                            <Icon size={14} className="text-indigo-600" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{skill}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Education & Experience */}
          <div className="md:col-span-1">
            <GlassCard className="h-full" delay={0.3} isDarkMode={isDarkMode}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Education</h2>
              <div className="space-y-6">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 h-fit flex-shrink-0">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{edu.institution}</h4>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{edu.studyType} in {edu.area}</p>
                      <p className="text-xs text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full" delay={0.4} isDarkMode={isDarkMode}>
              <h2 className={`text-xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Experience</h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <TimelineItem 
                    key={idx}
                    title={exp.position}
                    company={exp.institution || exp.company || ""}
                    period={`${exp.startDate} - ${exp.endDate}`}
                    description={exp.description}
                    type={exp.type}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Projects & Connect */}
          <div className="md:col-span-2">
            <GlassCard className="h-full" delay={0.5} isDarkMode={isDarkMode}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Projects</h2>
                {resumeData.basics.profiles.find(p => p.network.toLowerCase() === 'github')?.url && (
                  <a href={resumeData.basics.profiles.find(p => p.network.toLowerCase() === 'github')?.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline z-10 relative" title="View all projects on GitHub">
                    View All
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resumeData.projects.map((proj, idx) => (
                  <ProjectCard 
                    key={idx}
                    title={proj.name} 
                    description={proj.description}
                    tags={proj.highlights}
                    icon={Terminal}
                    link={proj.link}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="h-full flex flex-col" delay={0.6} isDarkMode={isDarkMode}>
              <h2 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Connect</h2>
              <div className="space-y-3 flex-grow">
                {resumeData.basics.profiles.map(profile => {
                  const Icon = getNetworkIcon(profile.network);
                  let bgColor = "bg-slate-900";
                  if (profile.network.toLowerCase() === 'twitter') bgColor = "bg-blue-400";
                  if (profile.network.toLowerCase() === 'linkedin') bgColor = "bg-blue-700";

                  return (
                    <a key={profile.network} href={profile.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-3 rounded-2xl border transition-all group shadow-sm z-10 relative ${
                      isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/20 border-white/30 hover:bg-white/30'
                    }`}>
                      <div className={`p-2 rounded-xl ${bgColor} text-white`}>
                        <Icon size={18} />
                      </div>
                      <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{profile.network}</span>
                      <ExternalLink size={14} className="ml-auto text-slate-400 group-hover:text-slate-600" />
                    </a>
                  );
                })}
              </div>
              <a href={`mailto:${resumeData.basics.email}`} className="w-full mt-4 py-3.5 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 z-10 relative">
                <Mail size={18} />
                Message
              </a>
            </GlassCard>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} {resumeData.basics.name}. Built with precision and intelligence.</p>
        </footer>
      </main>

      {/* Top Floating Dock */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 glass px-4 py-3 rounded-full flex items-center gap-4 z-50 border border-white/40 shadow-xl w-max">
        {/* Left Side: System Controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle (Placeholder) */}
          <motion.div
            whileHover={{ y: -4, scale: 1.1 }}
            className="w-11 h-11 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white/40 transition-colors"
            title="Switch Language (Coming Soon)"
          >
            <Globe size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-700'} />
          </motion.div>
          
          {/* Theme Toggle */}
          <motion.div
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ y: -4, scale: 1.1 }}
            className="w-11 h-11 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white/40 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} className="text-orange-500" /> : <Moon size={20} className="text-indigo-600" />}
          </motion.div>
        </div>

        {/* Vertical Separator */}
        <div className="w-[2px] h-6 bg-slate-400/30 mix-blend-overlay rounded-full mx-1"></div>

        {/* Right Side: Socials & Actions */}
        <div className="flex items-center gap-4">
          {resumeData.basics.profiles.map((profile, i) => {
            const Icon = getNetworkIcon(profile.network);
            return (
              <motion.a
                key={i}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-11 h-11 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white/40 transition-colors"
                title={profile.network}
              >
                <Icon size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-700'} />
              </motion.a>
            );
          })}
          <motion.a
            href={`mailto:${resumeData.basics.email}`}
            whileHover={{ y: -4, scale: 1.1 }}
            className="w-11 h-11 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white/40 transition-colors"
            title="Email Me"
          >
            <Mail size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-700'} />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
