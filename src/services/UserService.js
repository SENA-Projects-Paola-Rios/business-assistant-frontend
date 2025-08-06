// Lista simulada de usuarios para trabajar sin conexión a API

const mockUsers = [
  { id: 1, nombre: 'Juan Perez', email: 'juan@example.com', rol: 'Administrador' },
  { id: 2, nombre: 'Ana Lopez', email: 'ana@example.com', rol: 'Vendedor' },
];

// Servicio simulado con funciones CRUD

const UserService = {
  getAll: () => mockUsers, 
  getById: (id) => mockUsers.find(u => u.id === id), 
  create: (user) => { mockUsers.push({ id: mockUsers.length + 1, ...user }); },
  update: (id, user) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index > -1) mockUsers[index] = { ...mockUsers[index], ...user };
  },
  delete: (id) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index > -1) mockUsers.splice(index, 1);
  },
};

export default UserService;
