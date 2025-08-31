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
          // console.log('🔑 Token found for request:', config.url, 'Token:', token.substring(0, 20) + '...');
        } else {
          console.log('❌ No token found in user data:', parsed);
        }
      } else {
        console.log('❌ No user data in localStorage');
      }
    } catch (err) {
      console.log('❌ Error parsing user data:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.log('❌ API Error:', status, url, error.response?.data);
    
    // Only redirect on 401 for non-relationship endpoints
    // or if it's actually an auth issue (not "no relationship found")
    if (status === 401 && !url?.includes('/relationships/current')) {
      console.log('🚪 Redirecting to login due to auth error');
      localStorage.removeItem('whisper_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;