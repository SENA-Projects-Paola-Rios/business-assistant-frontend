// src/services/SalesService.js
import api from './api'; // Importamos la instancia configurada con interceptores

const SalesService = {
  // Obtener todas las ventas
  getAll: async () => {
    const response = await api.get('/sales');
    return response.data;
  },

  // Obtener una venta por ID
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  // Obtener ventas por ID de usuario
  getByUserId: async (userId) => {
    const response = await api.get(`/sales/user/${userId}`);
    return response.data;
  },

  // Crear una venta
  create: async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  // Actualizar una venta
  update: async (id, saleData) => {
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
  },

  // Eliminar una venta
  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  }
};

export default SalesService;
