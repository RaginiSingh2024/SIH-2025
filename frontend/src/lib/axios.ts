import type { AxiosResponse, AxiosProgressEvent } from 'axios';
import type {
  User,
  Quiz,
  Document,
  Flashcard,
  LoginForm,
  QuizAnswer,
  QuizAttempt,
  AuthResponse,
  RegisterForm,
  dashboardProps,
  PaginatedResponse,
} from '../types';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------
export const authAPI = {
  register: async (data: RegisterForm): Promise<{ token: string }> => {
    const response: AxiosResponse<{ data: AuthResponse }> = await axiosInstance.post(
      '/api/auth/register',
      data
    );
    return response.data.data;
  },

  login: async (data: LoginForm): Promise<AuthResponse> => {
    const response: AxiosResponse<{ data: AuthResponse }> = await axiosInstance.post(
      '/api/auth/login',
      data
    );
    return response.data.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await axiosInstance.get('/api/auth/me');
    return response.data.data;
  },
};

// Documents API
export const documentsAPI = {
  upload: async (
    data: File[],
    config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ): Promise<{ success: boolean; document: Document }> => {
    const formData = new FormData();
    data.forEach((file) => formData.append('document', file));

    const response = await axiosInstance.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: config?.onUploadProgress,
    });
    return response.data;
  },

  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Document>> => {
    const response = await axiosInstance.get(`/api/documents?page=${page}&limit=${limit}`);
    return {
      success: response.data.data.success,
      data: response.data.data.documents,
      pagination: response.data.data.pagination,
    };
  },

  generateFlashcard: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.get(`/api/documents/generate/${id}`);
    return response.data;
  },
};

// Flashcards API
export const flashcardsAPI = {
  getAll: async (
    page = 1,
    limit = 20,
    filters?: {
      document?: string;
      tags?: string;
      difficulty?: string;
    }
  ): Promise<PaginatedResponse<Flashcard>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.document) params.append('document', filters.document);
    if (filters?.tags) params.append('tags', filters.tags);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);

    const response = await axiosInstance.get(`/api/flashcards?${params}`);
    return {
      success: response.data.data.success,
      data: response.data.data.flashcards,
      pagination: response.data.data.pagination,
    };
  },
};

// Quizzes API
export const quizzesAPI = {
  getAll: async (page = 1, limit = 20, documentId?: string): Promise<PaginatedResponse<Quiz>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (documentId) params.append('document', documentId);

    const response = await axiosInstance.get(`/api/quizzes?${params}`);
    return {
      success: response.data.data.success,
      data: response.data.data.quizzes,
      pagination: response.data.data.pagination,
    };
  },

  generateQuiz: async (id: string): Promise<{ quizId: string }> => {
    const response = await axiosInstance.get(`/api/quizzes/generate/${id}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<{ success: boolean; quiz: Quiz }> => {
    const response = await axiosInstance.get(`/api/quizzes/${id}`);
    return response.data.data;
  },

  submitAttempt: async (
    id: string,
    data: { answers: QuizAnswer[]; duration: number }
  ): Promise<{
    success: boolean;
    attempt: QuizAttempt & {
      correctAnswers: number;
      totalQuestions: number;
      results: Array<{
        question: unknown;
        userAnswer: string;
        isCorrect: boolean;
        correctAnswer: string;
        explanation?: string;
      }>;
    };
  }> => {
    const response = await axiosInstance.post(`/api/quizzes/${id}/attempt`, data);
    return response.data;
  },

  getAttempt: async (
    id: string
  ): Promise<{
    quiz: Quiz;
  }> => {
    const response = await axiosInstance.get(`/api/quizzes/attempts/${id}`);
    return response.data.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<dashboardProps> => {
    const response = await axiosInstance.get('/api/dashboard/stats');
    return response.data.data;
  },
};

// Profile API
export const profileAPI = {
  getProfile: async (): Promise<{ profile: any }> => {
    const response = await axiosInstance.get('/api/profile');
    return response.data.data;
  },

  updateProfile: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put('/api/profile', data);
    return response.data.data;
  },

  // Projects
  addProject: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/projects', data);
    return response.data.data;
  },

  updateProject: async (projectId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/projects/${projectId}`, data);
    return response.data.data;
  },

  deleteProject: async (projectId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/projects/${projectId}`);
    return response.data.data;
  },

  // Experience
  addExperience: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/experiences', data);
    return response.data.data;
  },

  updateExperience: async (experienceId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/experiences/${experienceId}`, data);
    return response.data.data;
  },

  deleteExperience: async (experienceId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/experiences/${experienceId}`);
    return response.data.data;
  },

  // Education
  addEducation: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/education', data);
    return response.data.data;
  },

  updateEducation: async (educationId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/education/${educationId}`, data);
    return response.data.data;
  },

  deleteEducation: async (educationId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/education/${educationId}`);
    return response.data.data;
  },

  // Skills
  addSkill: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/skills', data);
    return response.data.data;
  },

  updateSkill: async (skillId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/skills/${skillId}`, data);
    return response.data.data;
  },

  deleteSkill: async (skillId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/skills/${skillId}`);
    return response.data.data;
  },

  // Certificates
  addCertificate: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/certificates', data);
    return response.data.data;
  },

  updateCertificate: async (certificateId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/certificates/${certificateId}`, data);
    return response.data.data;
  },

  deleteCertificate: async (certificateId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/certificates/${certificateId}`);
    return response.data.data;
  },

  // Extracurriculars
  addExtracurricular: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/extracurriculars', data);
    return response.data.data;
  },

  updateExtracurricular: async (extracurricularId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/extracurriculars/${extracurricularId}`, data);
    return response.data.data;
  },

  deleteExtracurricular: async (extracurricularId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/extracurriculars/${extracurricularId}`);
    return response.data.data;
  },

  // Accomplishments
  addAccomplishment: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/accomplishments', data);
    return response.data.data;
  },

  updateAccomplishment: async (accomplishmentId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/accomplishments/${accomplishmentId}`, data);
    return response.data.data;
  },

  deleteAccomplishment: async (accomplishmentId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/accomplishments/${accomplishmentId}`);
    return response.data.data;
  },

  // Training Details
  addTrainingDetails: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/training', data);
    return response.data.data;
  },

  updateTrainingDetails: async (trainingId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/training/${trainingId}`, data);
    return response.data.data;
  },

  deleteTrainingDetails: async (trainingId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/training/${trainingId}`);
    return response.data.data;
  },

  // Social Links
  addSocialLink: async (data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.post('/api/profile/social-links', data);
    return response.data.data;
  },

  updateSocialLink: async (socialLinkId: string, data: any): Promise<{ profile: any }> => {
    const response = await axiosInstance.put(`/api/profile/social-links/${socialLinkId}`, data);
    return response.data.data;
  },

  deleteSocialLink: async (socialLinkId: string): Promise<{ profile: any }> => {
    const response = await axiosInstance.delete(`/api/profile/social-links/${socialLinkId}`);
    return response.data.data;
  },

  // Achievements
  updateAchievements: async (data: { type: string; increment?: number }): Promise<{ profile: any }> => {
    const response = await axiosInstance.put('/api/profile/achievements', data);
    return response.data.data;
  },
};
