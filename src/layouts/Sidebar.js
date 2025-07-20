import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHome, faUsers, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import authService from '../services/authService';

/**
 * Sidebar lateral, siempre visible en pantallas grandes.
 * En móviles funciona como menú colapsable.
 */
export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    authService.logout();
    navigate('/');  // Redirige al login
  };

  return (
    <aside className="sidebar p-3">
      {/* Logo completo SOLO visible en pantallas grandes */}
      <div className="app-logo d-none d-md-flex align-items-center justify-content-center mb-4">
        <FontAwesomeIcon icon={faCartShopping} size="2x" className="me-2" />
        <div className="text-container">
          <h2 className="m-0 fw-bold">SUPERMARKET</h2>
          <small>Business Assistant</small>
        </div>
      </div>

      {/* Logo + botón cerrar SOLO visible en móviles */}
      <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
        <div className="app-logo d-flex align-items-center">
          <FontAwesomeIcon icon={faCartShopping} size="2x" className="me-2" />
          <div className="text-container">
            <h2 className="m-0 fs-5">SUPERMARKET</h2>
            <small>Business Assistant</small>
          </div>
        </div>
        <button
          className="btn-close"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="sidebar-link" to="/dashboard">
            <FontAwesomeIcon icon={faHome} />
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="sidebar-link" to="/users">
            <FontAwesomeIcon icon={faUsers} />
            Usuarios
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="sidebar-link"
            to="/login"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Cerrar Sesión
          </Link>
        </li>
      </ul>
    </aside>
  );
}
