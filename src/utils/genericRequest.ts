import axios from 'axios';
import { useAccountStore } from '@/stores/account';

const baseUrl = import.meta.env.VITE_APP_URL_API;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const genericRequest = async (url, method, body) => {
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
      headers: {
        Authorization: `Bearer ${accountStore.token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error en la solicitud: ${error.response?.data || error.message}`);
  }
};
