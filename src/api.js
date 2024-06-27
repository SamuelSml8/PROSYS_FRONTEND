import axios from "axios";
import contactInfo from "./data/data.json";
import { getToken, logout } from "./utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Interceptor de solicitud para agregar el token a las cabeceras
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout(); // Elimina el token si está presente
      window.location.href = "/"; // Redirige a la página de inicio
    }
    return Promise.reject(error);
  }
);

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

// Product endpoints
export const getAllProducts = (page, limit) =>
  api.get(`/product/all?page=${page || 1}&limit=${limit || 10}`);
export const getProductById = (id) => api.get(`/product/${id}`);
export const createProduct = (data) => api.post("/product/create", data);
export const updateProduct = (id, data) =>
  api.put(`/product/update/${id}`, data);
export const deleteProduct = (id) => api.delete(`/product/delete/${id}`);
export const findProductByName = (name) => api.get(`/product/find/${name}`);

// User endpoints
export const getAllUsers = (page, limit) =>
  api.get(`/user/all?page=${page || 1}&limit=${limit || 10}`);
export const createUser = (data) => api.post("/user/create", data);
export const updateUser = (id, data) => api.put(`/user/update/${id}`, data);
export const deleteUser = (id) => api.delete(`/user/delete/${id}`);
export const findUserByEmail = (email) => api.get(`/user/find/email/${email}`);
export const findUserByName = (name) => api.get(`/user/find/name/${name}`);

// Order endpoints
export const getAllOrders = (page, limit) =>
  api.get(`/order/all?page=${page || 1}&limit=${limit || 10}`);
export const createOrder = (data) => api.post("/order/create", data);
export const updateOrder = (id, data) => api.put(`/order/update/${id}`, data);
export const deleteOrder = (id) => api.delete(`/order/delete/${id}`);

// Category endpoints
export const getAllCategories = (page, limit) =>
  api.get(`/category/all?page=${page || 1}&limit=${limit || 10}`);
export const createCategory = (data) => api.post("/category/create", data);
export const updateCategory = (id, data) =>
  api.put(`/category/update/${id}`, data);
export const deleteCategory = (id) => api.delete(`/category/delete/${id}`);
export const findCategoryByName = (name) => api.get(`/category/find/${name}`);

export const getContactInfo = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (contactInfo) {
        resolve(contactInfo);
      } else {
        reject("No se pudo obtener la información de contacto");
      }
    }, 500); // Simulamos un tiempo de carga
  });
};
