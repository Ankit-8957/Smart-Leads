import axios from 'axios';

// Ensure the URL always has the /api prefix even if forgotten in environment variables
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Remove trailing slash if present
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

// Append /api if missing
if (!baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000,
});

// Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;