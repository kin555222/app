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
    // This would be implemented when backend supports it
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // For now, decode the token payload (in production, make API call)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { id: payload.sub }; // JWT 'sub' field contains user ID
    } catch {
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
  }
};

// User APIs
export const userAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/user/${userId}`);
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
