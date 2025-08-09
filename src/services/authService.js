import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  login: async ({ username, password }) => {
    try {
      //tomamos el username y password para llamar al servicio de autenticacion
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: username,
        password: password
      });

      // Si la API devuelve un token o datos de usuario, los guardamos en localStorage
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  getUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;
