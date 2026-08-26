import type { ResumeData as SharedResumeData } from '@portfolio/resume-schema';

export type ResumeData = SharedResumeData;
export type ResumeSectionKey = 'education' | 'skills' | 'experience' | 'projects';

export interface ResumeVisibility {
  basics: {
    role: boolean;
    field: boolean;
    contact: boolean;
    location: boolean;
    profiles: boolean;
    about: boolean;
    photo: boolean;
  };
  sections: Record<ResumeSectionKey, boolean>;
  items: Record<string, boolean>;
  bullets: Record<string, boolean>;
}

export interface ResumeBalance {
  auto: boolean;
  adjustment: number;
}
