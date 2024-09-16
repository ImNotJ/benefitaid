import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Ensure this matches your backend server URL
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
  (config) => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;