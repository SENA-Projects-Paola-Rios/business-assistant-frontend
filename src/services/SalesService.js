import SaleDetailService from './SaleDetailService';
// Lista simulada de ventas
const mockSales = [
  {
    id: 1,
    sale_date: '2025-08-30',
    total: 25000,
    user_id: 1,
    user_name: 'Carlos López',
  },
  {
    id: 2,
    sale_date: '2025-08-31',
    total: 12000,
    user_id: 2,
    user_name: 'María Gómez',
  },
];

// Servicio simulado para operaciones CRUD sobre ventas
const SalesService = {
  // Obtener todas las ventas con su total actualizado desde los detalles
  getAll: () => {
    return mockSales.map(sale => {
      const details = SaleDetailService.getBySaleId(sale.id);
      const total = details.reduce((acc, d) => acc + (d.subtotal || 0), 0);
      return { ...sale, total };
    });
  },

  // Obtener una venta por su ID con total actualizado
  getById: (id) => {
    const sale = mockSales.find(s => s.id === id);
    if (!sale) return null;
    const details = SaleDetailService.getBySaleId(sale.id);
    const total = details.reduce((acc, d) => acc + (d.subtotal || 0), 0);
    return { ...sale, total };
  },

  // Crear una nueva venta y devolver la nueva instancia con ID y total
  create: (sale) => {
    const newId = mockSales.length ? Math.max(...mockSales.map(s => s.id)) + 1 : 1;
    const newSale = { id: newId, total: 0, ...sale };
    mockSales.push(newSale);
    return newSale; // Se retorna para poder usar el ID luego
  },

  // Actualizar una venta y su total según detalles actuales
  update: (id, sale) => {
    const index = mockSales.findIndex(s => s.id === id);
    if (index > -1) {
      const details = SaleDetailService.getBySaleId(id);
      const total = details.reduce((acc, d) => acc + (d.subtotal || 0), 0);
      mockSales[index] = { ...mockSales[index], ...sale, total };
    }
  },

  // Eliminar una venta
  delete: (id) => {
    const index = mockSales.findIndex(s => s.id === id);
    if (index > -1) mockSales.splice(index, 1);
  }
};

export default SalesService;