import axios from 'axios';
import storage from '../storage';
import config from '../../config';

const instance = axios.create({
  baseURL: config.baseURL,
});

instance.interceptors.request.use(async (axiosConfig) => {
  return axiosConfig;
});

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 429) {
      error = 'Too many requests. Please try again later.';
    } else if (error?.response?.status === 401) {
      error = error.response.data.message;
    } else if (
      error.toString().indexOf('Network Error') > -1 ||
      error.toString().indexOf('timeout of') > -1
    ) {
      error = 'Connection error. Try again later.';
    }
    return Promise.reject(error);
  },
);

export default instance;
