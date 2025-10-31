import axios from 'axios';
// Corrected path for importing API_URL from the configuration folder
import API_URL from '../config/api'; 

const apiAuth = axios.create({
    baseURL: API_URL,
});

// Inside src/utils/apiAuth.js

apiAuth.interceptors.request.use(config => {
    const token = localStorage.getItem('userToken'); // Retrieves the token string
    
    if (token) {
        // CRITICAL: Ensure the token is attached in the exact 'Bearer TOKEN' format
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the token is not present, the request still goes out,
    // and the backend will reject it with 401 Unauthorized.
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiAuth;
