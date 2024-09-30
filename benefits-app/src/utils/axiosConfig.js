import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Ensure this matches your backend server URL
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, log out the user
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/user-login'; // Redirect to user login page
    }
    return Promise.reject(error);
  }
);

export default instance;