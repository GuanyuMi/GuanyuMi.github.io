import { z } from 'zod';

export const localeSchema = z.enum(['en', 'zh']);
export type Locale = z.infer<typeof localeSchema>;

const profileSchema = z.object({ network: z.string(), username: z.string(), url: z.string() });
const locationSchema = z.object({ postalCode: z.string(), city: z.string(), countryCode: z.string(), region: z.string() });
const educationSchema = z.object({ institution: z.string(), location: z.string(), area: z.string(), studyType: z.string(), startDate: z.string(), endDate: z.string(), courses: z.array(z.string()) });
const experienceSchema = z.object({ type: z.string().optional(), name: z.string().optional(), company: z.string().optional(), institution: z.string().optional(), facility: z.string().optional(), supervisor: z.string().optional(), position: z.string(), startDate: z.string(), endDate: z.string(), summary: z.string().optional(), description: z.array(z.string()).optional(), highlights: z.array(z.string()).optional() });
const skillSchema = z.object({ name: z.string().optional(), category: z.string().optional(), keywords: z.array(z.string()) });
const projectSchema = z.object({ name: z.string(), link: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional(), description: z.array(z.string()).optional(), highlights: z.array(z.string()).optional() });

export const resumeDataSchema = z.object({
  basics: z.object({ name: z.string(), gender: z.string().optional(), birth: z.string().optional(), image: z.string(), email: z.string(), 'personal-website': z.string(), role: z.string().optional(), field: z.string().optional(), about: z.string().optional(), summary: z.string().optional(), location: locationSchema, profiles: z.array(profileSchema) }),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema).optional(),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;
export const parseResumeData = (value: unknown) => resumeDataSchema.safeParse(value);
