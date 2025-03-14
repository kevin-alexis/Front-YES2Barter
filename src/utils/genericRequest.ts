import axios from 'axios';
import { useAccountStore } from '@/stores/account';

const baseUrl = import.meta.env.VITE_APP_URL_API;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const accountStore = useAccountStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/Account/refreshToken')) {
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await accountStore.refreshToken();
        refreshSubscribers.forEach((callback) => callback(newToken));
        refreshSubscribers = [];
        isRefreshing = false;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        if (refreshError.response?.status === 403) {
          accountStore.logOut();
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const genericRequest = async (url, method, body?, rememberMe?) => {
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

export const genericRequestFormDataAuthenticated = async (url, method, formData) => {
  try {
    const accountStore = useAccountStore();
    const response = await axiosInstance({
      url,
      method: method.toUpperCase(),
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accountStore.token}`,
      },
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
    const response = await axiosInstance({
      url,
      method: method.toUpperCase(),
      data: method.toLowerCase() !== 'get' ? body : undefined,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Sesión expirada. Redirigiendo a login...');
    }
    console.error(`Error en la solicitud a ${url}:`, error.response?.data || error.message);
    throw new Error(error.response?.data || error.message);
  }
};
