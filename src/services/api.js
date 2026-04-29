import axios from "axios";
import { clearAuth } from "./authService";

//edit*****
const api = axios.create({
  baseURL: "https://mindroad.runasp.net",
});
//********
// const api = axios.create({
//   baseURL: "https://mindroad.runasp.net/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

//attach jwt  to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//if token expired => log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default api;
