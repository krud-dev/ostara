import axios from 'axios';

export const baseUrl = `${window.daemonAddress}/api/v1`;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
});
