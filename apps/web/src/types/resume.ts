import type { ResumeData } from '@portfolio/resume-schema';

export type { ResumeData };
export type ExperienceItem = ResumeData['experience'][number];
export type ProjectItem = NonNullable<ResumeData['projects']>[number];
