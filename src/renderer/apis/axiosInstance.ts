import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: `${window.daemonAddress}/api/v1`,
});
