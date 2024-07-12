import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      const errorMessage = error.response.data.message;
      message.error(errorMessage);

      if (
        errorMessage === 'Token expired' ||
        errorMessage === 'Token Invalid' ||
        error.response.data.error === 'token_expired' ||
        error.response.data.error === 'token_invalid'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
