import axios from 'axios';
import { getToken } from './storage';
import { Platform } from 'react-native';

// Production URL
const BASE_URL = 'http://api.omnivael.com:4000/api';

// const BASE_URL = Platform.OS === 'android' 
//   ? 'http://10.0.2.2:4000/api' 
//   : 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
