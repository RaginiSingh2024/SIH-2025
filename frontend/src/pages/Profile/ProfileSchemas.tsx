import { z as zod } from 'zod';

// Project Schema
export const projectSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  role: zod
    .string()
    .trim()
    .min(1, 'Role is required')
    .max(50, 'Role must be less than 50 characters'),
  skills: zod.array(zod.string()).min(1, 'At least one skill is required'),
  codeLinks: zod
    .array(zod.string().trim().min(1, 'Code link is required'))
    .min(1, 'At least one code link is required'),
  hostedLinks: zod
    .array(zod.string().trim().min(1, 'Hosted link is required'))
    .min(1, 'At least one hosted link is required'),
  description: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

// Experience Schema
export const experienceSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be less than 100 characters'),
  company: zod
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  location: zod
    .string()
    .trim()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  type: zod.string().trim().min(1, 'Job type is required'),
  startDate: zod.string().min(1, 'Start date is required'),
  endDate: zod.string().optional(),
  currentlyWorking: zod.boolean(),
  isWFH: zod.boolean(),
  description: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
});

// Subject Schema for Education
export const subjectSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(1, 'Subject name is required')
    .max(50, 'Subject name must be less than 50 characters'),
  obtainedMarks: zod
    .string()
    .trim()
    .min(1, 'Obtained marks is required')
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Obtained marks must be a valid number',
    }),
  totalMarks: zod
    .string()
    .trim()
    .min(1, 'Total marks is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Total marks must be a valid positive number',
    }),
});

// Education Schema
export const educationSchema = zod.object({
  degree: zod
    .string()
    .trim()
    .min(1, 'Degree is required')
    .max(100, 'Degree must be less than 100 characters'),
  institution: zod
    .string()
    .trim()
    .min(1, 'Institution is required')
    .max(100, 'Institution must be less than 100 characters'),
  sYear: zod.string().min(1, 'Start year is required'),
  eYear: zod.string().optional(),
  ongoing: zod.boolean(),
  subjects: zod.array(subjectSchema).min(1, 'At least one subject is required'),
  grade: zod.string().trim().min(1, 'Grade is required'),
  scale: zod.enum(['percentage', 'CGPA']),
});

// Skills Schema
export const skillsSchema = zod.object({
  skills: zod
    .array(zod.string().trim().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one skill is required'),
});

// Single Skill Schema
export const skillSchema = zod.object({
  skillTitle: zod
    .string()
    .trim()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name must be less than 50 characters'),
  level: zod.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Skill level is required',
  }),
});

// Certification Schema
export const certificationSchema = zod.object({
  program: zod
    .string()
    .trim()
    .min(1, 'Program name is required')
    .max(100, 'Program name must be less than 100 characters'),
  organization: zod
    .string()
    .trim()
    .min(1, 'Organization is required')
    .max(100, 'Organization must be less than 100 characters'),
  sDate: zod.string().min(1, 'Start date is required'),
  eDate: zod.string().optional(),
  isOngoing: zod.boolean().default(false),
  description: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

// Certificate Schema
export const certificateSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  text: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  url: zod.string().url('Must be a valid URL').min(1, 'Certificate URL is required'),
});

// Extracurricular Schema
export const extracurricularSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  text: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
});

// Accomplishment Schema
export const accomplishmentSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  text: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

// Training Details Schema
export const trainingDetailsSchema = zod.object({
  program: zod
    .string()
    .trim()
    .min(1, 'Program name is required')
    .max(100, 'Program name must be less than 100 characters'),
  organization: zod
    .string()
    .trim()
    .min(1, 'Organization is required')
    .max(100, 'Organization must be less than 100 characters'),
  sDate: zod.string().min(1, 'Start date is required'),
  eDate: zod.string().min(1, 'End date is required'),
  isOnline: zod.boolean(),
  location: zod
    .string()
    .trim()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  urls: zod
    .array(zod.string().trim().min(1, 'URL is required'))
    .min(1, 'At least one certificate URL is required'),
  description: zod
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

// Profile Data Types
export type ProjectFormData = zod.infer<typeof projectSchema>;
export type ExperienceFormData = zod.infer<typeof experienceSchema>;
export type EducationFormData = zod.infer<typeof educationSchema>;
export type SkillsFormData = zod.infer<typeof skillsSchema>;
export type SkillFormData = zod.infer<typeof skillSchema>;
export type CertificationFormData = zod.infer<typeof certificationSchema>;
export type CertificateFormData = zod.infer<typeof certificateSchema>;
export type ExtracurricularFormData = zod.infer<typeof extracurricularSchema>;
export type AccomplishmentFormData = zod.infer<typeof accomplishmentSchema>;
export type TrainingDetailsFormData = zod.infer<typeof trainingDetailsSchema>;
