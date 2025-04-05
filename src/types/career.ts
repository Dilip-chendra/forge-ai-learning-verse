
// Job-related types
export type JobPlatform = 'LinkedIn' | 'Indeed' | 'AngelList' | 'Internshala' | 'Wellfound' | 'GitHub Jobs';

export type JobRole = 'Data Scientist' | 'Frontend Developer' | 'Backend Developer' | 'Full Stack Developer' | 
  'UX Designer' | 'Product Manager' | 'DevOps Engineer' | 'ML Engineer' | 'AI Researcher' | 
  'Mobile Developer' | 'QA Engineer' | string;

export type CompanyType = 'Startup' | 'MNC' | 'NGO' | 'Government' | 'Enterprise' | string;

export type JobLocationType = 'Remote' | 'On-site' | 'Hybrid';

export type ExperienceLevel = 'Intern' | 'Entry Level' | 'Junior' | 'Mid Level' | 'Senior' | 'Lead' | 'Manager';

export type ApplicationStatus = 'Preparing' | 'Applied' | 'Rejected' | 'Interview Scheduled' | 'Offer Received' | 'Accepted';

// User profile and preferences
export interface UserProfile {
  resumeUrl?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrent?: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  isCurrent?: boolean;
}

export interface JobPreferences {
  roles: JobRole[];
  locations: string[];
  locationType: JobLocationType[];
  companyTypes: CompanyType[];
  minSalary?: number;
  experienceLevel: ExperienceLevel[];
  remote: boolean;
}

// Job listings and applications
export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyType?: CompanyType;
  location: string;
  locationType: JobLocationType;
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  postedDate: Date;
  deadline?: Date;
  url: string;
  platform: JobPlatform;
  relevanceScore?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  appliedDate: Date;
  status: ApplicationStatus;
  resumeVersion: string;
  coverLetterVersion: string;
  notes?: string;
  interviewDate?: Date;
  feedbackReceived?: string;
}

// Analytics
export interface JobAnalytics {
  totalApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  mostResponsiveCompanies: {company: string, responseRate: number}[];
  mostResponsiveRoles: {role: string, responseRate: number}[];
  averageResponseTime: number;
}
