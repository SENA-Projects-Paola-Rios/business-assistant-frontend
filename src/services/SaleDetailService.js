// src/services/SalesDetailService.js
import api from './api'; // Importamos la instancia configurada con interceptores

const SalesDetailService = {
  // Obtener todos los detalles de venta
  getAll: async () => {
    const response = await api.get('/sale-details');
    return response.data;
  },

  // Obtener detalle por saleId y lotId
  getBySaleIdAndLotId: async (saleId, lotId) => {
    const response = await api.get(`/sale-details/sale/${saleId}/lot/${lotId}`);
    return response.data;
  },

  // Obtener detalles por lotId
  getByLotId: async (lotId) => {
    const response = await api.get(`/sale-details/lot/${lotId}`);
    return response.data;
  },

  // Obtener detalles por saleId
  getBySaleId: async (saleId) => {
    const response = await api.get(`/sale-details/sale/${saleId}`);
    return response.data;
  },

  // Obtener detalles por userId
  getByUserId: async (userId) => {
    const response = await api.get(`/sales/sale-details/${userId}`);
    return response.data;
  },

  // Crear un detalle de venta
  create: async (saleDetailData) => {
    const response = await api.post('/sale-details', saleDetailData);
    return response.data;
  },

  // Eliminar detalle de venta por saleId y lotId
  delete: async (saleId, lotId) => {
    const response = await api.delete(`/sale-details/sale/${saleId}/lot/${lotId}`);
    return response.data;
  }
};

export default SalesDetailService;
