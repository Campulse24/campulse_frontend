import axios from 'axios';

// Base API URL - adjust if your backend runs on a different port
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('campulse_token');
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
            // Token expired or invalid
            localStorage.removeItem('campulse_token');
            localStorage.removeItem('campulse_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ========================================
// AUTHENTICATION ENDPOINTS
// ========================================

export const authAPI = {
    // POST /api/v1/auth/signup
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // POST /api/v1/auth/login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // GET /api/v1/auth/me
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// ========================================
// TASKS ENDPOINTS (Academic Planner)
// ========================================

export const tasksAPI = {
    // GET /tasks - List all tasks
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    // POST /tasks - Create new task
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // PATCH /tasks/{id} - Update task
    updateTask: async (id, taskData) => {
        const response = await api.patch(`/tasks/${id}`, taskData);
        return response.data;
    },

    // DELETE /tasks/{id} - Delete task
    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};

// ========================================
// OPPORTUNITIES ENDPOINTS
// ========================================

export const opportunitiesAPI = {
    // GET /opportunities - Browse opportunities with optional category filter
    getOpportunities: async (category = null) => {
        const params = category ? { category } : {};
        const response = await api.get('/opportunities', { params });
        return response.data;
    },

    // GET /opportunities/{id} - Get opportunity details
    getOpportunityById: async (id) => {
        const response = await api.get(`/opportunities/${id}`);
        return response.data;
    },

    // POST /opportunities/{id}/bookmark - Bookmark opportunity
    bookmarkOpportunity: async (id) => {
        const response = await api.post(`/opportunities/${id}/bookmark`);
        return response.data;
    },
};

// ========================================
// TUTORS ENDPOINTS
// ========================================

export const tutorsAPI = {
    // GET /tutors - List tutors with optional course code filter
    getTutors: async (courseCode = null) => {
        const params = courseCode ? { course_code: courseCode } : {};
        const response = await api.get('/tutors', { params });
        return response.data;
    },

    // GET /tutors/{id} - Get tutor details
    getTutorById: async (id) => {
        const response = await api.get(`/tutors/${id}`);
        return response.data;
    },
};

// Export the configured axios instance for custom requests
export default api;
