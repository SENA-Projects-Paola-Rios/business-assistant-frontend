// src/services/CategoryService.js
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
      // Capturamos la respuesta del backend con errores de validación
      return {
        success: false,
        data: error.response.data
      };
    }
    // Error inesperado o de red
    return {
      success: false,
      data: { message: 'Error de conexión con el servidor' }
    };
  }
};

const CategoryService = {
  getAll: () => handleRequest(() => api.get('/categories')),
  getById: (id) => handleRequest(() => api.get(`/categories/${id}`)),
  create: (categoryData) => handleRequest(() => api.post('/categories', categoryData)),
  update: (id, categoryData) => handleRequest(() => api.put(`/categories/${id}`, categoryData)),
  delete: (id) => handleRequest(() => api.delete(`/categories/${id}`))
};

export default CategoryService;
