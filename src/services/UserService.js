// src/services/UserService.js
import api from './api';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      // Aquí capturamos el mensaje del backend en caso de error 400, 422, etc.
      return {
        success: false,
        data: error.response.data
      };
    }
    // Si no hay respuesta, es un error de red u otro problema
    return {
      success: false,
      data: { message: 'Error de conexión con el servidor' }
    };
  }
};

const UserService = {
  getAll: () => handleRequest(() => api.get('/users')),
  getById: (id) => handleRequest(() => api.get(`/users/${id}`)),
  create: (userData) => handleRequest(() => api.post('/users', userData)),
  update: (id, userData) => handleRequest(() => api.put(`/users/${id}`, userData)),
  delete: (id) => handleRequest(() => api.delete(`/users/${id}`))
};

export default UserService;
