import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use the environment variable for the base URL
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
      const role = localStorage.getItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (role === 'ROLE_ADMIN' || role === 'ROLE_ROOT_ADMIN') {
        window.location.href = '/admin-login'; // Redirect to admin login page
      } else {
        window.location.href = '/user-login'; // Redirect to user login page
      }
    }
    return Promise.reject(error);
  }
);

export default instance;