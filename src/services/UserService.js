// src/services/UserService.js
import api from './api'; // Importamos la instancia configurada con interceptores

const UserService = {
  // Obtener todos los usuarios
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Crear un usuario
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Actualizar un usuario
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar un usuario
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default UserService;
