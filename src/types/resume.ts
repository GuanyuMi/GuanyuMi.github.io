export interface Location {
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Basics {
  name: string;
  image: string;
  email: string;
  "personal-website": string;
  role: string;
  field: string;
  about: string;
  location: Location;
  profiles: Profile[];
}

export interface EducationItem {
  institution: string;
  location: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  courses: string[];
}

export interface ExperienceItem {
  type: string;
  position: string;
  institution?: string;
  company?: string;
  facility?: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface SkillGroup {
  category: string;
  keywords: string[];
}

export interface ProjectItem {
  name: string;
  link: string;
  startDate: string;
  description: string[];
  highlights: string[];
}

export interface ResumeData {
  basics: Basics;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
}
