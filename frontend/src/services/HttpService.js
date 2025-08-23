import axios from "axios";
import { BACKEND_URL } from "../constants";

export const HttpService = axios.create({
  baseURL: BACKEND_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

HttpService.interceptors.request.use((config)=>{
  config.headers.Authorization = 'Bearer' + localStorage.getItem('Bearer');
  return config;
});

HttpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.setItem('Bearer', '');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
