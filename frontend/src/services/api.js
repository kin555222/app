import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  signup: async (username, email, password) => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Now, make an actual API call to get the full user profile
      const response = await api.get(`/user/${payload.sub}`);
      return response.data.user; // Assuming the backend returns { user: {...} }
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      // If token is invalid or expired, the response interceptor will handle redirect
      return null;
    }
  }
};

// Resources APIs
export const resourcesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  }
};

// Quiz APIs
export const quizAPI = {
  submit: async (resourceId, answers) => {
    const response = await api.post('/quiz/submit', {
      resource_id: resourceId,
      answers
    });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },
  create: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  update: async (quizId, quizData) => {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },
  delete: async (quizId) => {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  }
};

// User APIs
export const userAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  }
};

// Admin APIs
export const adminAPI = {
  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
  
  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  
  toggleUserAdmin: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/toggle-admin`);
    return response.data;
  },
  
  // Resource Management
  createResource: async (resourceData) => {
    const response = await api.post('/admin/resources', resourceData);
    return response.data;
  },
  
  updateResource: async (resourceId, resourceData) => {
    const response = await api.put(`/admin/resources/${resourceId}`, resourceData);
    return response.data;
  },
  
  deleteResource: async (resourceId) => {
    const response = await api.delete(`/admin/resources/${resourceId}`);
    return response.data;
  },
  
  // Quiz Management
  getAllQuizzes: async (params = {}) => {
    const response = await api.get('/admin/quizzes', { params });
    return response.data;
  },
  
  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  
  updateQuiz: async (quizId, quizData) => {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },
  
  deleteQuiz: async (quizId) => {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  },
  
  // Alert Management
  getAllAlerts: async (params = {}) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },
  
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },
  
  dismissAlert: async (alertId) => {
    const response = await api.post(`/alerts/${alertId}/dismiss`);
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const healthUrl = baseUrl.replace('/api', '/health');
    const response = await axios.get(healthUrl);
    return response.data;
  }
};

export default api;
