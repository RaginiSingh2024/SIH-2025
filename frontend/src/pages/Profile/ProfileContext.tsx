import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { profileAPI } from 'src/lib/axios';

// Types
interface ProfileState {
  profile: any | null;
  loading: boolean;
  error: string | null;
}

interface ProfileContextType extends ProfileState {
  updateProfile: (data: any) => Promise<void>;
  addProject: (data: any) => Promise<void>;
  updateProject: (id: string, data: any) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addExperience: (data: any) => Promise<void>;
  updateExperience: (id: string, data: any) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addEducation: (data: any) => Promise<void>;
  updateEducation: (id: string, data: any) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  addSkill: (data: any) => Promise<void>;
  updateSkill: (id: string, data: any) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addCertificate: (data: any) => Promise<void>;
  updateCertificate: (id: string, data: any) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  addExtracurricular: (data: any) => Promise<void>;
  updateExtracurricular: (id: string, data: any) => Promise<void>;
  deleteExtracurricular: (id: string) => Promise<void>;
  addAccomplishment: (data: any) => Promise<void>;
  updateAccomplishment: (id: string, data: any) => Promise<void>;
  deleteAccomplishment: (id: string) => Promise<void>;
  addTrainingDetails: (data: any) => Promise<void>;
  updateTrainingDetails: (id: string, data: any) => Promise<void>;
  deleteTrainingDetails: (id: string) => Promise<void>;
  addSocialLink: (data: any) => Promise<void>;
  updateSocialLink: (id: string, data: any) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Actions
type ProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROFILE'; payload: any }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer
const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, loading: false, error: null };
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

  const refreshProfile = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await profileAPI.getProfile();
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      // If profile doesn't exist, that's okay - user hasn't created one yet
      if (error.message === 'Profile not found') {
        dispatch({ type: 'SET_PROFILE', payload: null });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch profile' });
      }
    }
  };

  const updateProfile = async (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await profileAPI.updateProfile(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update profile' });
      throw error;
    }
  };

  const addProject = async (data: any) => {
    try {
      const result = await profileAPI.addProject(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add project' });
      throw error;
    }
  };

  const updateProject = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateProject(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update project' });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const result = await profileAPI.deleteProject(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete project' });
      throw error;
    }
  };

  const addExperience = async (data: any) => {
    try {
      const result = await profileAPI.addExperience(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add experience' });
      throw error;
    }
  };

  const updateExperience = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateExperience(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update experience' });
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const result = await profileAPI.deleteExperience(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete experience' });
      throw error;
    }
  };

  const addEducation = async (data: any) => {
    try {
      const result = await profileAPI.addEducation(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add education' });
      throw error;
    }
  };

  const updateEducation = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateEducation(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update education' });
      throw error;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const result = await profileAPI.deleteEducation(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete education' });
      throw error;
    }
  };

  const addSkill = async (data: any) => {
    try {
      const result = await profileAPI.addSkill(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add skill' });
      throw error;
    }
  };

  const updateSkill = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateSkill(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update skill' });
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const result = await profileAPI.deleteSkill(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete skill' });
      throw error;
    }
  };

  const addCertificate = async (data: any) => {
    try {
      const result = await profileAPI.addCertificate(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add certificate' });
      throw error;
    }
  };

  const updateCertificate = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateCertificate(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update certificate' });
      throw error;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      const result = await profileAPI.deleteCertificate(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete certificate' });
      throw error;
    }
  };

  const addExtracurricular = async (data: any) => {
    try {
      const result = await profileAPI.addExtracurricular(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add extracurricular' });
      throw error;
    }
  };

  const updateExtracurricular = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateExtracurricular(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update extracurricular' });
      throw error;
    }
  };

  const deleteExtracurricular = async (id: string) => {
    try {
      const result = await profileAPI.deleteExtracurricular(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete extracurricular' });
      throw error;
    }
  };

  const addAccomplishment = async (data: any) => {
    try {
      const result = await profileAPI.addAccomplishment(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add accomplishment' });
      throw error;
    }
  };

  const updateAccomplishment = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateAccomplishment(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update accomplishment' });
      throw error;
    }
  };

  const deleteAccomplishment = async (id: string) => {
    try {
      const result = await profileAPI.deleteAccomplishment(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete accomplishment' });
      throw error;
    }
  };

  const addTrainingDetails = async (data: any) => {
    try {
      const result = await profileAPI.addTrainingDetails(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add training details' });
      throw error;
    }
  };

  const updateTrainingDetails = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateTrainingDetails(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update training details' });
      throw error;
    }
  };

  const deleteTrainingDetails = async (id: string) => {
    try {
      const result = await profileAPI.deleteTrainingDetails(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete training details' });
      throw error;
    }
  };

  const addSocialLink = async (data: any) => {
    try {
      const result = await profileAPI.addSocialLink(data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add social link' });
      throw error;
    }
  };

  const updateSocialLink = async (id: string, data: any) => {
    try {
      const result = await profileAPI.updateSocialLink(id, data);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update social link' });
      throw error;
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      const result = await profileAPI.deleteSocialLink(id);
      dispatch({ type: 'SET_PROFILE', payload: result.profile });
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
