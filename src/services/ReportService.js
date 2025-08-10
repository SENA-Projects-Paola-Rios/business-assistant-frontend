// src/services/ReportService.js
import api from './api'; // Importamos la instancia configurada con interceptores

const ReportService = {
  // Obtener todos los reportes
  getAll: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  // Obtener un reporte por ID
  getById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Crear un nuevo reporte
  create: async (reportData) => {
    // reportData puede incluir: reportType, fileName, slug, fields
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  // Actualizar un reporte existente
  update: async (id, reportData) => {
    // reportData puede incluir: id, reportType, fileName, slug, fields
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  // Eliminar un reporte
  delete: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // Generar un reporte
  generate: async (slug, params) => {
    // params es un objeto con query params como { user_id: 1, total: 0 }
    const response = await api.get(`/reports/generate/${slug}`, { params });
    return response.data;
  }
};

export default ReportService;
