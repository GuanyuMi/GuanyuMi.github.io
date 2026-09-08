import { parseResumeData, type ResumeData } from '@portfolio/resume-schema';

const result = parseResumeData(__RESUME_SNAPSHOT__);

if (!result.success) throw new Error('The embedded resume snapshot is invalid');

export const publishedResume: ResumeData = result.data;
