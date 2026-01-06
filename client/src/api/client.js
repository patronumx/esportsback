import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost'
        ? 'https://petite-towns-follow.loca.lt/api'
        : '/api'),
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Dispatch custom event for AuthContext to handle
            import('../utils/toast').then(({ showToast }) => {
                showToast.error("Session Expired: Please login again.");
            });
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);

export default api;
