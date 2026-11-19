import axios, { AxiosInstance } from 'axios';
// config
import Qs from 'qs';
import { isValid, isDate } from 'date-fns';
import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------

const axiosInstance: AxiosInstance = axios.create({
  baseURL: HOST_API_KEY,
  paramsSerializer(params) {
    return Qs.stringify(params, {
      arrayFormat: 'brackets',
      filter: (prefix, value) => {
        if (isDate(value) || isValid(value)) {
          return value.toISOString();
        }
        return value;
      },
    });
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
