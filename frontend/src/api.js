import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // 如有需要可改为环境变量
});

// 请求拦截器，自动加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/users/register", data);
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const reportProblem = (formData) =>
  api.post("/problems", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getProblems = () => api.get("/problems");
export const updateProblemStatus = (id, status) =>
  api.patch(`/problems/${id}/status`, { status });
export const getProblemStats = () => api.get("/problems/stats");

export default api;
