// Lista simulada de lotes
const mockLots = [
  {
    id: 1,
    manufacturer_lot: 'LOT123ABC',
    expiration_date: '2025-11-01',
    stock: 120,
    unit_price: 2500, 
    product_id: 1,
    product_name: 'Jugo de Naranja',
  },
  {
    id: 2,
    manufacturer_lot: 'LOT456DEF',
    expiration_date: '2025-09-15',
    stock: 75,
    unit_price: 3000, 
    product_id: 2,
    product_name: 'Leche Deslactosada',
  },
];

// Servicio simulado para operaciones CRUD de lotes
const LotService = {
  // Obtener todos los lotes
  getAll: () => mockLots,

  // Buscar lote por ID
  getById: (id) => mockLots.find(l => l.id === id),

  // Crear un nuevo lote
  create: (lot) => {
    mockLots.push({ id: mockLots.length + 1, ...lot });
  },

  // Actualizar un lote existente
  update: (id, lot) => {
    const index = mockLots.findIndex(l => l.id === id);
    if (index > -1) mockLots[index] = { ...mockLots[index], ...lot };
  },

  // Eliminar un lote por ID
  delete: (id) => {
    const index = mockLots.findIndex(l => l.id === id);
    if (index > -1) mockLots.splice(index, 1);
  },
};

export default LotService;
