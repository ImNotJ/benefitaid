// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Ensure this matches your backend server URL
});

export default instance;