// Lista simulada de productos
const mockProducts = [
  {
    id: 1,
    name: 'Jugo de Naranja',
    description: 'Botella de 1L de jugo natural sin azúcar',
    price: 5500,
    category_id: 1,
    category_name: 'Bebidas',
    lot_id: 1,
    manufacturer_lot: 'LOT123ABC',
    stock: 120,
  },
  {
    id: 2,
    name: 'Leche Deslactosada',
    description: 'Caja de 1L de leche deslactosada',
    price: 4800,
    category_id: 2,
    category_name: 'Lácteos',
    lot_id: 2,
    manufacturer_lot: 'LOT456DEF',
    stock: 75,
  },
];

// Servicio simulado con funciones CRUD
const ProductService = {
  getAll: () => mockProducts,
  getById: (id) => mockProducts.find(p => p.id === id),
  create: (product) => {
    mockProducts.push({ id: mockProducts.length + 1, ...product });
  },
  update: (id, product) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index > -1) mockProducts[index] = { ...mockProducts[index], ...product };
  },
  delete: (id) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index > -1) mockProducts.splice(index, 1);
  },
};

export default ProductService;
