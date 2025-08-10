// src/services/LotService.js
import api from './api'; // Importamos la instancia configurada con interceptores

const LotService = {
  // Obtener todos los lotes
  getAll: async () => {
    const response = await api.get('/lots');
    return response.data;
  },

  // Obtener un lote por ID
  getById: async (id) => {
    const response = await api.get(`/lots/${id}`);
    return response.data;
  },

  // Crear un lote
  create: async (lotData) => {
    const response = await api.post('/lots', lotData);
    return response.data;
  },

  // Actualizar un lote
  update: async (id, lotData) => {
    const response = await api.put(`/lots/${id}`, lotData);
    return response.data;
  },

  // Eliminar un lote
  delete: async (id) => {
    const response = await api.delete(`/lots/${id}`);
    return response.data;
  }
};

export default LotService;
