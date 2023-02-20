import axios from "axios";
import { API_URI } from "../../utils/constant";

const API = axios.create({ baseURL: API_URI });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const getUser = (userId) =>
  API.get(`/user/${userId}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const updateUser = (id, formData) =>
  API.put(`/user/${id}`, formData, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const getAllUsers = (username) =>
  API.post(`/user`, username, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const follow = (id, data) =>
  API.put(`/user/${id}/follow`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
export const unfollow = (id, data) =>
  API.put(`/user/${id}/unfollow`, data, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
