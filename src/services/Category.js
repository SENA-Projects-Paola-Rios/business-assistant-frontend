// Lista simulada de categorías para trabajar sin conexión a API

const mockCategories = [
  { id: 1, name: 'Bebidas', description: 'Productos líquidos como jugos, aguas y gaseosas' },
  { id: 2, name: 'Lácteos', description: 'Productos derivados de la leche como yogur, queso, etc.' },
];

// Servicio simulado con funciones CRUD

const CategoryService = {
  getAll: () => mockCategories,
  getById: (id) => mockCategories.find(c => c.id === id),
  create: (category) => {
    mockCategories.push({ id: mockCategories.length + 1, ...category });
  },
  update: (id, category) => {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index > -1) mockCategories[index] = { ...mockCategories[index], ...category };
  },
  delete: (id) => {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index > -1) mockCategories.splice(index, 1);
  },
};

export default CategoryService;
