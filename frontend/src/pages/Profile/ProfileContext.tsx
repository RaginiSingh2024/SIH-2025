import React, { createContext, useContext, useEffect, useReducer } from 'react';

// Session storage keys
const PROFILE_STORAGE_KEY = 'lms_profile_data';
const PROJECTS_STORAGE_KEY = 'lms_projects_data';
const EXPERIENCE_STORAGE_KEY = 'lms_experience_data';
const EDUCATION_STORAGE_KEY = 'lms_education_data';
const SKILLS_STORAGE_KEY = 'lms_skills_data';
const CERTIFICATES_STORAGE_KEY = 'lms_certificates_data';
const EXTRACURRICULARS_STORAGE_KEY = 'lms_extracurriculars_data';
const ACCOMPLISHMENTS_STORAGE_KEY = 'lms_accomplishments_data';
const TRAINING_STORAGE_KEY = 'lms_training_data';
const SOCIAL_LINKS_STORAGE_KEY = 'lms_social_links_data';

// Helper functions for session storage
const getFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from sessionStorage key ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to sessionStorage key ${key}:`, error);
  }
};

// Mock initial data
const initialProfileData = {
  firstName: 'Anoop Gupta',
  username: 'anoop',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore necessitatibus vero mollitia sint dolores facere ipsa aliquid inventore culpa, minus expedita maiores non voluptatibus perferendis recusandae quidem, quia doloremque perspiciatis.',
  gender: 'Male',
  email: 'anoop@example.com',
  phone: '1234567890',
  dob: '1990-01-01',
  addressline1: '123 Main Street',
  city: 'Jaipur',
  state: 'Rajasthan',
  pincode: '302001',
  country: 'India',
  college: 'School of Future Tech',
  initials: 'AG',
  followers: 0,
  following: 0,
  avatar: null,
  resumeUrl: null,
};

const initialProjectsData = [
  {
    id: '1',
    title: 'E-Bike Website',
    description: 'A comprehensive e-commerce platform for electric bikes with modern UI/UX design.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    status: 'In Progress',
    startDate: '2024-01-15',
    endDate: null,
    githubUrl: 'https://github.com/example/e-bike',
    liveUrl: 'https://e-bike-demo.com',
    role: 'Developer'
  }
];

const initialExperienceData = [
  {
    id: '1',
    company: 'Tech Innovations Inc.',
    position: 'Full Stack Developer',
    location: 'Jaipur, India',
    startDate: '2023-06-01',
    endDate: null,
    current: true,
    description: 'Working on cutting-edge web applications using React, Node.js, and cloud technologies.',
    technologies: ['React', 'Node.js', 'AWS', 'MongoDB']
  }
];

const initialEducationData = [
  {
    id: '1',
    institution: 'School of Future Tech',
    degree: 'Bachelor of Technology',
    field: 'Computer Science Engineering',
    startDate: '2021-08-01',
    endDate: '2025-06-01',
    current: true,
    grade: '8.5 CGPA',
    description: 'Specialized in software engineering and artificial intelligence.'
  }
];

const initialSkillsData = [
  { id: '1', name: 'React', level: 'Advanced', category: 'Frontend' },
  { id: '2', name: 'Node.js', level: 'Intermediate', category: 'Backend' },
  { id: '3', name: 'JavaScript', level: 'Advanced', category: 'Programming' },
  { id: '4', name: 'TypeScript', level: 'Intermediate', category: 'Programming' },
  { id: '5', name: 'MongoDB', level: 'Intermediate', category: 'Database' }
];

const initialCertificatesData = [
  {
    id: '1',
    name: 'React Development Certification',
    issuer: 'Meta',
    issueDate: '2024-03-15',
    expiryDate: null,
    credentialId: 'META-REACT-2024-001',
    url: 'https://coursera.org/verify/example',
    description: 'Comprehensive certification in React development including hooks, context, and performance optimization.'
  }
];

const initialExtracurricularsData = [
  {
    id: '1',
    activity: 'Coding Club President',
    organization: 'School of Future Tech',
    role: 'President',
    startDate: '2023-08-01',
    endDate: null,
    current: true,
    description: 'Leading a team of 50+ students in organizing hackathons, coding competitions, and technical workshops.'
  }
];

const initialAccomplishmentsData = [
  {
    id: '1',
    title: 'Winner - National Hackathon 2024',
    description: 'First place in the national level hackathon for developing an AI-powered educational platform.',
    date: '2024-05-20',
    category: 'Competition',
    issuer: 'Tech Ministry, India'
  }
];

const initialTrainingData = [
  {
    id: '1',
    title: 'Full Stack Web Development',
    provider: 'Tech Academy',
    duration: '6 months',
    startDate: '2023-01-01',
    endDate: '2023-06-30',
    certificate: true,
    description: 'Comprehensive training in modern web development technologies including MERN stack.'
  }
];

const initialSocialLinksData = [
  {
    id: '1',
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/anoopgupta',
    icon: 'linkedin'
  },
  {
    id: '2',
    platform: 'GitHub',
    url: 'https://github.com/anoopg7',
    icon: 'github'
  }
];

// Types
interface ProfileState {
  profile: any | null;
  projects: any[];
  experience: any[];
  education: any[];
  skills: any[];
  certificates: any[];
  extracurriculars: any[];
  accomplishments: any[];
  training: any[];
  socialLinks: any[];
  loading: boolean;
  error: string | null;
}

interface ProfileContextType extends ProfileState {
  updateProfile: (data: any) => void;
  addProject: (data: any) => void;
  updateProject: (id: string, data: any) => void;
  deleteProject: (id: string) => void;
  addExperience: (data: any) => void;
  updateExperience: (id: string, data: any) => void;
  deleteExperience: (id: string) => void;
  addEducation: (data: any) => void;
  updateEducation: (id: string, data: any) => void;
  deleteEducation: (id: string) => void;
  addSkill: (data: any) => void;
  updateSkill: (id: string, data: any) => void;
  deleteSkill: (id: string) => void;
  addCertificate: (data: any) => void;
  updateCertificate: (id: string, data: any) => void;
  deleteCertificate: (id: string) => void;
  addExtracurricular: (data: any) => void;
  updateExtracurricular: (id: string, data: any) => void;
  deleteExtracurricular: (id: string) => void;
  addAccomplishment: (data: any) => void;
  updateAccomplishment: (id: string, data: any) => void;
  deleteAccomplishment: (id: string) => void;
  addTrainingDetails: (data: any) => void;
  updateTrainingDetails: (id: string, data: any) => void;
  deleteTrainingDetails: (id: string) => void;
  addSocialLink: (data: any) => void;
  updateSocialLink: (id: string, data: any) => void;
  deleteSocialLink: (id: string) => void;
  refreshProfile: () => void;
}

// Actions
type ProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROFILE'; payload: any }
  | { type: 'SET_PROJECTS'; payload: any[] }
  | { type: 'SET_EXPERIENCE'; payload: any[] }
  | { type: 'SET_EDUCATION'; payload: any[] }
  | { type: 'SET_SKILLS'; payload: any[] }
  | { type: 'SET_CERTIFICATES'; payload: any[] }
  | { type: 'SET_EXTRACURRICULARS'; payload: any[] }
  | { type: 'SET_ACCOMPLISHMENTS'; payload: any[] }
  | { type: 'SET_TRAINING'; payload: any[] }
  | { type: 'SET_SOCIAL_LINKS'; payload: any[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer
const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, loading: false, error: null };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_EXPERIENCE':
      return { ...state, experience: action.payload };
    case 'SET_EDUCATION':
      return { ...state, education: action.payload };
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    case 'SET_CERTIFICATES':
      return { ...state, certificates: action.payload };
    case 'SET_EXTRACURRICULARS':
      return { ...state, extracurriculars: action.payload };
    case 'SET_ACCOMPLISHMENTS':
      return { ...state, accomplishments: action.payload };
    case 'SET_TRAINING':
      return { ...state, training: action.payload };
    case 'SET_SOCIAL_LINKS':
      return { ...state, socialLinks: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState: ProfileState = {
  profile: null,
  projects: [],
  experience: [],
  education: [],
  skills: [],
  certificates: [],
  extracurriculars: [],
  accomplishments: [],
  training: [],
  socialLinks: [],
  loading: false,
  error: null,
};

// Context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Fetch profile on mount
  useEffect(() => {
    refreshProfile();
  }, []);

  const refreshProfile = () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const profile = getFromStorage(PROFILE_STORAGE_KEY);
      dispatch({ type: 'SET_PROFILE', payload: profile });
      
      // Load all related data
      const projects = getFromStorage(PROJECTS_STORAGE_KEY) || initialProjectsData;
      const experience = getFromStorage(EXPERIENCE_STORAGE_KEY) || initialExperienceData;
      const education = getFromStorage(EDUCATION_STORAGE_KEY) || initialEducationData;
      const skills = getFromStorage(SKILLS_STORAGE_KEY) || initialSkillsData;
      const certificates = getFromStorage(CERTIFICATES_STORAGE_KEY) || initialCertificatesData;
      const extracurriculars = getFromStorage(EXTRACURRICULARS_STORAGE_KEY) || initialExtracurricularsData;
      const accomplishments = getFromStorage(ACCOMPLISHMENTS_STORAGE_KEY) || initialAccomplishmentsData;
      const training = getFromStorage(TRAINING_STORAGE_KEY) || initialTrainingData;
      const socialLinks = getFromStorage(SOCIAL_LINKS_STORAGE_KEY) || initialSocialLinksData;
      
      dispatch({ type: 'SET_PROJECTS', payload: projects });
      dispatch({ type: 'SET_EXPERIENCE', payload: experience });
      dispatch({ type: 'SET_EDUCATION', payload: education });
      dispatch({ type: 'SET_SKILLS', payload: skills });
      dispatch({ type: 'SET_CERTIFICATES', payload: certificates });
      dispatch({ type: 'SET_EXTRACURRICULARS', payload: extracurriculars });
      dispatch({ type: 'SET_ACCOMPLISHMENTS', payload: accomplishments });
      dispatch({ type: 'SET_TRAINING', payload: training });
      dispatch({ type: 'SET_SOCIAL_LINKS', payload: socialLinks });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch profile' });
    }
  };

  const updateProfile = (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      saveToStorage(PROFILE_STORAGE_KEY, data);
      dispatch({ type: 'SET_PROFILE', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update profile' });
      throw error;
    }
  };

  const addProject = (data: any) => {
    try {
      const currentProjects = getFromStorage(PROJECTS_STORAGE_KEY) || [];
      const newProject = { ...data, id: Date.now().toString() };
      const updatedProjects = [...currentProjects, newProject];
      saveToStorage(PROJECTS_STORAGE_KEY, updatedProjects);
      dispatch({ type: 'SET_PROJECTS', payload: updatedProjects });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add project' });
      throw error;
    }
  };

  const updateProject = (id: string, data: any) => {
    try {
      const currentProjects = getFromStorage(PROJECTS_STORAGE_KEY) || [];
      const updatedProjects = currentProjects.map((project: any) =>
        project.id === id ? { ...project, ...data } : project
      );
      saveToStorage(PROJECTS_STORAGE_KEY, updatedProjects);
      dispatch({ type: 'SET_PROJECTS', payload: updatedProjects });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update project' });
      throw error;
    }
  };

  const deleteProject = (id: string) => {
    try {
      const currentProjects = getFromStorage(PROJECTS_STORAGE_KEY) || [];
      const updatedProjects = currentProjects.filter((project: any) => project.id !== id);
      saveToStorage(PROJECTS_STORAGE_KEY, updatedProjects);
      dispatch({ type: 'SET_PROJECTS', payload: updatedProjects });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete project' });
      throw error;
    }
  };

  const addExperience = (data: any) => {
    try {
      const currentExperience = getFromStorage(EXPERIENCE_STORAGE_KEY) || [];
      const newExperience = { ...data, id: Date.now().toString() };
      const updatedExperience = [...currentExperience, newExperience];
      saveToStorage(EXPERIENCE_STORAGE_KEY, updatedExperience);
      dispatch({ type: 'SET_EXPERIENCE', payload: updatedExperience });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add experience' });
      throw error;
    }
  };

  const updateExperience = (id: string, data: any) => {
    try {
      const currentExperience = getFromStorage(EXPERIENCE_STORAGE_KEY) || [];
      const updatedExperience = currentExperience.map((exp: any) =>
        exp.id === id ? { ...exp, ...data } : exp
      );
      saveToStorage(EXPERIENCE_STORAGE_KEY, updatedExperience);
      dispatch({ type: 'SET_EXPERIENCE', payload: updatedExperience });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update experience' });
      throw error;
    }
  };

  const deleteExperience = (id: string) => {
    try {
      const currentExperience = getFromStorage(EXPERIENCE_STORAGE_KEY) || [];
      const updatedExperience = currentExperience.filter((exp: any) => exp.id !== id);
      saveToStorage(EXPERIENCE_STORAGE_KEY, updatedExperience);
      dispatch({ type: 'SET_EXPERIENCE', payload: updatedExperience });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete experience' });
      throw error;
    }
  };

  const addEducation = (data: any) => {
    try {
      const currentEducation = getFromStorage(EDUCATION_STORAGE_KEY) || [];
      const newEducation = { ...data, id: Date.now().toString() };
      const updatedEducation = [...currentEducation, newEducation];
      saveToStorage(EDUCATION_STORAGE_KEY, updatedEducation);
      dispatch({ type: 'SET_EDUCATION', payload: updatedEducation });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add education' });
      throw error;
    }
  };

  const updateEducation = (id: string, data: any) => {
    try {
      const currentEducation = getFromStorage(EDUCATION_STORAGE_KEY) || [];
      const updatedEducation = currentEducation.map((edu: any) =>
        edu.id === id ? { ...edu, ...data } : edu
      );
      saveToStorage(EDUCATION_STORAGE_KEY, updatedEducation);
      dispatch({ type: 'SET_EDUCATION', payload: updatedEducation });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update education' });
      throw error;
    }
  };

  const deleteEducation = (id: string) => {
    try {
      const currentEducation = getFromStorage(EDUCATION_STORAGE_KEY) || [];
      const updatedEducation = currentEducation.filter((edu: any) => edu.id !== id);
      saveToStorage(EDUCATION_STORAGE_KEY, updatedEducation);
      dispatch({ type: 'SET_EDUCATION', payload: updatedEducation });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete education' });
      throw error;
    }
  };

  const addSkill = (data: any) => {
    try {
      const currentSkills = getFromStorage(SKILLS_STORAGE_KEY) || [];
      const newSkill = { ...data, id: Date.now().toString() };
      const updatedSkills = [...currentSkills, newSkill];
      saveToStorage(SKILLS_STORAGE_KEY, updatedSkills);
      dispatch({ type: 'SET_SKILLS', payload: updatedSkills });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add skill' });
      throw error;
    }
  };

  const updateSkill = (id: string, data: any) => {
    try {
      const currentSkills = getFromStorage(SKILLS_STORAGE_KEY) || [];
      const updatedSkills = currentSkills.map((skill: any) =>
        skill.id === id ? { ...skill, ...data } : skill
      );
      saveToStorage(SKILLS_STORAGE_KEY, updatedSkills);
      dispatch({ type: 'SET_SKILLS', payload: updatedSkills });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update skill' });
      throw error;
    }
  };

  const deleteSkill = (id: string) => {
    try {
      const currentSkills = getFromStorage(SKILLS_STORAGE_KEY) || [];
      const updatedSkills = currentSkills.filter((skill: any) => skill.id !== id);
      saveToStorage(SKILLS_STORAGE_KEY, updatedSkills);
      dispatch({ type: 'SET_SKILLS', payload: updatedSkills });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete skill' });
      throw error;
    }
  };

  const addCertificate = (data: any) => {
    try {
      const currentCertificates = getFromStorage(CERTIFICATES_STORAGE_KEY) || [];
      const newCertificate = { ...data, id: Date.now().toString() };
      const updatedCertificates = [...currentCertificates, newCertificate];
      saveToStorage(CERTIFICATES_STORAGE_KEY, updatedCertificates);
      dispatch({ type: 'SET_CERTIFICATES', payload: updatedCertificates });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add certificate' });
      throw error;
    }
  };

  const updateCertificate = (id: string, data: any) => {
    try {
      const currentCertificates = getFromStorage(CERTIFICATES_STORAGE_KEY) || [];
      const updatedCertificates = currentCertificates.map((cert: any) =>
        cert.id === id ? { ...cert, ...data } : cert
      );
      saveToStorage(CERTIFICATES_STORAGE_KEY, updatedCertificates);
      dispatch({ type: 'SET_CERTIFICATES', payload: updatedCertificates });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update certificate' });
      throw error;
    }
  };

  const deleteCertificate = (id: string) => {
    try {
      const currentCertificates = getFromStorage(CERTIFICATES_STORAGE_KEY) || [];
      const updatedCertificates = currentCertificates.filter((cert: any) => cert.id !== id);
      saveToStorage(CERTIFICATES_STORAGE_KEY, updatedCertificates);
      dispatch({ type: 'SET_CERTIFICATES', payload: updatedCertificates });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete certificate' });
      throw error;
    }
  };

  const addExtracurricular = (data: any) => {
    try {
      const currentExtracurriculars = getFromStorage(EXTRACURRICULARS_STORAGE_KEY) || [];
      const newExtracurricular = { ...data, id: Date.now().toString() };
      const updatedExtracurriculars = [...currentExtracurriculars, newExtracurricular];
      saveToStorage(EXTRACURRICULARS_STORAGE_KEY, updatedExtracurriculars);
      dispatch({ type: 'SET_EXTRACURRICULARS', payload: updatedExtracurriculars });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add extracurricular' });
      throw error;
    }
  };

  const updateExtracurricular = (id: string, data: any) => {
    try {
      const currentExtracurriculars = getFromStorage(EXTRACURRICULARS_STORAGE_KEY) || [];
      const updatedExtracurriculars = currentExtracurriculars.map((ext: any) =>
        ext.id === id ? { ...ext, ...data } : ext
      );
      saveToStorage(EXTRACURRICULARS_STORAGE_KEY, updatedExtracurriculars);
      dispatch({ type: 'SET_EXTRACURRICULARS', payload: updatedExtracurriculars });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update extracurricular' });
      throw error;
    }
  };

  const deleteExtracurricular = (id: string) => {
    try {
      const currentExtracurriculars = getFromStorage(EXTRACURRICULARS_STORAGE_KEY) || [];
      const updatedExtracurriculars = currentExtracurriculars.filter((ext: any) => ext.id !== id);
      saveToStorage(EXTRACURRICULARS_STORAGE_KEY, updatedExtracurriculars);
      dispatch({ type: 'SET_EXTRACURRICULARS', payload: updatedExtracurriculars });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete extracurricular' });
      throw error;
    }
  };

  const addAccomplishment = (data: any) => {
    try {
      const currentAccomplishments = getFromStorage(ACCOMPLISHMENTS_STORAGE_KEY) || [];
      const newAccomplishment = { ...data, id: Date.now().toString() };
      const updatedAccomplishments = [...currentAccomplishments, newAccomplishment];
      saveToStorage(ACCOMPLISHMENTS_STORAGE_KEY, updatedAccomplishments);
      dispatch({ type: 'SET_ACCOMPLISHMENTS', payload: updatedAccomplishments });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add accomplishment' });
      throw error;
    }
  };

  const updateAccomplishment = (id: string, data: any) => {
    try {
      const currentAccomplishments = getFromStorage(ACCOMPLISHMENTS_STORAGE_KEY) || [];
      const updatedAccomplishments = currentAccomplishments.map((acc: any) =>
        acc.id === id ? { ...acc, ...data } : acc
      );
      saveToStorage(ACCOMPLISHMENTS_STORAGE_KEY, updatedAccomplishments);
      dispatch({ type: 'SET_ACCOMPLISHMENTS', payload: updatedAccomplishments });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update accomplishment' });
      throw error;
    }
  };

  const deleteAccomplishment = (id: string) => {
    try {
      const currentAccomplishments = getFromStorage(ACCOMPLISHMENTS_STORAGE_KEY) || [];
      const updatedAccomplishments = currentAccomplishments.filter((acc: any) => acc.id !== id);
      saveToStorage(ACCOMPLISHMENTS_STORAGE_KEY, updatedAccomplishments);
      dispatch({ type: 'SET_ACCOMPLISHMENTS', payload: updatedAccomplishments });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete accomplishment' });
      throw error;
    }
  };

  const addTrainingDetails = (data: any) => {
    try {
      const currentTraining = getFromStorage(TRAINING_STORAGE_KEY) || [];
      const newTraining = { ...data, id: Date.now().toString() };
      const updatedTraining = [...currentTraining, newTraining];
      saveToStorage(TRAINING_STORAGE_KEY, updatedTraining);
      dispatch({ type: 'SET_TRAINING', payload: updatedTraining });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add training details' });
      throw error;
    }
  };

  const updateTrainingDetails = (id: string, data: any) => {
    try {
      const currentTraining = getFromStorage(TRAINING_STORAGE_KEY) || [];
      const updatedTraining = currentTraining.map((training: any) =>
        training.id === id ? { ...training, ...data } : training
      );
      saveToStorage(TRAINING_STORAGE_KEY, updatedTraining);
      dispatch({ type: 'SET_TRAINING', payload: updatedTraining });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update training details' });
      throw error;
    }
  };

  const deleteTrainingDetails = (id: string) => {
    try {
      const currentTraining = getFromStorage(TRAINING_STORAGE_KEY) || [];
      const updatedTraining = currentTraining.filter((training: any) => training.id !== id);
      saveToStorage(TRAINING_STORAGE_KEY, updatedTraining);
      dispatch({ type: 'SET_TRAINING', payload: updatedTraining });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete training details' });
      throw error;
    }
  };

  const addSocialLink = (data: any) => {
    try {
      const currentSocialLinks = getFromStorage(SOCIAL_LINKS_STORAGE_KEY) || [];
      const newSocialLink = { ...data, id: Date.now().toString() };
      const updatedSocialLinks = [...currentSocialLinks, newSocialLink];
      saveToStorage(SOCIAL_LINKS_STORAGE_KEY, updatedSocialLinks);
      dispatch({ type: 'SET_SOCIAL_LINKS', payload: updatedSocialLinks });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add social link' });
      throw error;
    }
  };

  const updateSocialLink = (id: string, data: any) => {
    try {
      const currentSocialLinks = getFromStorage(SOCIAL_LINKS_STORAGE_KEY) || [];
      const updatedSocialLinks = currentSocialLinks.map((link: any) =>
        link.id === id ? { ...link, ...data } : link
      );
      saveToStorage(SOCIAL_LINKS_STORAGE_KEY, updatedSocialLinks);
      dispatch({ type: 'SET_SOCIAL_LINKS', payload: updatedSocialLinks });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update social link' });
      throw error;
    }
  };

  const deleteSocialLink = (id: string) => {
    try {
      const currentSocialLinks = getFromStorage(SOCIAL_LINKS_STORAGE_KEY) || [];
      const updatedSocialLinks = currentSocialLinks.filter((link: any) => link.id !== id);
      saveToStorage(SOCIAL_LINKS_STORAGE_KEY, updatedSocialLinks);
      dispatch({ type: 'SET_SOCIAL_LINKS', payload: updatedSocialLinks });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete social link' });
      throw error;
    }
  };

  const value: ProfileContextType = {
    ...state,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addExtracurricular,
    updateExtracurricular,
    deleteExtracurricular,
    addAccomplishment,
    updateAccomplishment,
    deleteAccomplishment,
    addTrainingDetails,
    updateTrainingDetails,
    deleteTrainingDetails,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    refreshProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

// Hook
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
