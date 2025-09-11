import mongoose, { Document, Schema } from 'mongoose';

// Sub-schemas for different profile sections
const socialLinkSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const projectSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  role: { type: String, required: true, maxlength: 50 },
  skills: [{ type: String, required: true }],
  codeLinks: [{ type: String, required: true }],
  hostedLinks: [{ type: String, required: true }],
  description: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const experienceSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  company: { type: String, required: true, maxlength: 100 },
  location: { type: String, required: true, maxlength: 100 },
  type: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  currentlyWorking: { type: Boolean, default: false },
  isWFH: { type: Boolean, default: false },
  description: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

const subjectSchema = new Schema({
  name: { type: String, required: true, maxlength: 50 },
  obtainedMarks: { type: Number, required: true, min: 0 },
  totalMarks: { type: Number, required: true, min: 1 },
}, { _id: false });

const educationSchema = new Schema({
  degree: { type: String, required: true, maxlength: 100 },
  institution: { type: String, required: true, maxlength: 100 },
  sYear: { type: String, required: true },
  eYear: { type: String },
  ongoing: { type: Boolean, default: false },
  subjects: [subjectSchema],
  grade: { type: String, required: true },
  scale: { type: String, enum: ['percentage', 'CGPA'], default: 'percentage' },
}, { timestamps: true });

const skillSchema = new Schema({
  skillTitle: { type: String, required: true, maxlength: 50 },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
}, { timestamps: true });

const certificateSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  text: { type: String, required: true, maxlength: 500 },
  url: { type: String, required: true },
}, { timestamps: true });

const extracurricularSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  text: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

const accomplishmentSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  text: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const trainingDetailsSchema = new Schema({
  program: { type: String, required: true, maxlength: 100 },
  organization: { type: String, required: true, maxlength: 100 },
  sDate: { type: String, required: true },
  eDate: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  location: { type: String, required: true, maxlength: 100 },
  urls: [{ type: String, required: true }],
  description: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

// Main Profile Interface
export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  username?: string;
  description: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  dob: Date;
  addressline1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  profilePicture?: string;
  
  // Profile sections
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  projects: Array<any>;
  experiences: Array<any>;
  education: Array<any>;
  skills: Array<any>;
  certificates: Array<any>;
  extracurriculars: Array<any>;
  accomplishments: Array<any>;
  trainingDetails: Array<any>;
  
  // Achievements
  achievements: {
    studyStreak: number;
    quizzesTaken: number;
    flashcardsStudied: number;
    documentsUploaded: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    username: { type: String, trim: true, unique: true, sparse: true },
    description: { type: String, required: true },
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Other'], 
      required: true 
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    addressline1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    profilePicture: { type: String },
    
    // Profile sections
    socialLinks: [socialLinkSchema],
    projects: [projectSchema],
    experiences: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    certificates: [certificateSchema],
    extracurriculars: [extracurricularSchema],
    accomplishments: [accomplishmentSchema],
    trainingDetails: [trainingDetailsSchema],
    
    // Achievements
    achievements: {
      studyStreak: { type: Number, default: 0 },
      quizzesTaken: { type: Number, default: 0 },
      flashcardsStudied: { type: Number, default: 0 },
      documentsUploaded: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Index for better performance
profileSchema.index({ userId: 1 });
profileSchema.index({ username: 1 });

export default mongoose.model<IProfile>('Profile', profileSchema);
