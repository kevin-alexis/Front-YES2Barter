import axios from 'axios';
import { useAccountStore } from '@/stores/account';

const baseUrl = import.meta.env.VITE_APP_URL_API;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accountStore = useAccountStore();
  if (accountStore.token) {
      config.headers.Authorization = `Bearer ${accountStore.token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
      const accountStore = useAccountStore();

      if (error.response?.status === 401) {
          console.warn('Token expirado, intentando renovar...');

          const newToken = await accountStore.refreshToken();

          if (newToken) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(error.config);
          } else {
              accountStore.logOut();
          }
      }

      return Promise.reject(error);
  }
);

export const genericRequest = async (url, method, body, rememberMe?) => {
  try {
    const response = await axiosInstance({
      url,
      method: method.toUpperCase(),
      data: method.toLowerCase() !== 'get' ? body : undefined,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error en la solicitud: ${error.response?.data || error.message}`);
  }
};

export const genericRequestFormData = async (url, method, formData) => {
  try {
    const response = await axiosInstance({
      url,
      method: method.toUpperCase(),
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error en la solicitud: ${error.response?.data || error.message}`);
  }
};

export const genericRequestAuthenticated = async (url, method, body?) => {
  try {
      const accountStore = useAccountStore();

      const response = await axiosInstance({
          url,
          method: method.toUpperCase(),
          data: method.toLowerCase() !== 'get' ? body : undefined,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
              Authorization: `Bearer ${accountStore.token}`,
          }
      });

      return response.data;
  } catch (error) {
      throw new Error(`Error en la solicitud: ${error.response?.data || error.message}`);
  }
};

