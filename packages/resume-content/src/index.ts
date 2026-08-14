import type { Locale, ResumeData } from '@portfolio/resume-schema';
import resumeEn from './resume.json';
import resumeZh from './resume-ch.json';

export const defaultResumes: Record<Locale, ResumeData> = {
  en: resumeEn as ResumeData,
  zh: resumeZh as ResumeData,
};
