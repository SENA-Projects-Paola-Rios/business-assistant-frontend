import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authService.login(credentials)) {
      navigate('/dashboard');
    } else {
      alert('Credenciales inválidas');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`login-container ${darkMode ? 'dark-mode-login' : 'light-mode-login'}`}>
      
      {/* Botón modo claro/oscuro */}
      <button
        className="theme-toggle-btn-login align-self-end mb-3"
        onClick={toggleDarkMode}
        aria-label="Cambiar modo claro/oscuro"
      >
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      </button>

      {/* Logo */}
      <div className="login-logo text-center">
        <FontAwesomeIcon icon={faShoppingCart} size="2x" className="mb-2" />
        <h2 className="fw-bold m-0">SUPERMARKET</h2>
        <small>Business Assistant</small>
        <p className="small mt-1">Asistente de negocio en supermercados</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="login-box login-form">
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>

        <div className="mb-3 text-end">
          <small className="text-primary forgot-password">Olvidé mi contraseña</small>
        </div>

        <button type="submit" className="btn btn-dark w-100 btn-ingresar">Ingresar</button>
      </form>
    </div>
  );
}
