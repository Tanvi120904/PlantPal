import axios from 'axios';
// Corrected path for importing API_URL from the configuration folder
import API_URL from '../config/api'; 

const apiAuth = axios.create({
  baseURL: "http://localhost:5000/api",  // ✅ Correct base
});



// Inside src/utils/apiAuth.js
apiAuth.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // ✅ changed from userToken → token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));


export default apiAuth;
