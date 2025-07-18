/* Creamos un objeto llamado authService que contiene funciones relacionadas con la
 autenticación del usuario, para simular el inicio de sesión */

const authService = {
  login: ({ username, password }) => {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('user', JSON.stringify({ username }));
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService;
