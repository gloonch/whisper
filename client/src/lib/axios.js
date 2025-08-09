import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('whisper_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.accessToken || parsed?.token; // prefer accessToken (server response)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('whisper_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;