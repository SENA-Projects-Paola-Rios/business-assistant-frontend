// src/services/ProductService.js
import api from './api'; // Instancia configurada con interceptores (incluye token, etc.)

const ProductService = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Crear un producto
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Actualizar un producto
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar un producto
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Registrar una categoria para un producto
  addCategory: async(productCategoryData) => {
    const response = await api.post('/product-categories', productCategoryData);
    return response.data;
  },

  // Modificar una categoria para un producto
  deleteCategory: async(productId) => {
    const response = await api.delete(`/product-categories/product/${productId}/categories`);
    return response.data;
  }
};

export default ProductService;
