import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faHome,
  faUsers,
  faRightFromBracket,
  faLayerGroup,
  faList,
  faTableCells,
  faMoneyCheckDollar,
  faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons/faMoneyBillTrendUp';
import authService from '../services/authService';

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(); // Limpia el token/session del usuario
    navigate('/login');   // Redirige al login
  };

  return (
    <aside className="sidebar p-3">
      {/* Logo completo en pantallas grandes */}
      <div className="app-logo d-none d-md-flex align-items-center justify-content-center mb-4">
        <FontAwesomeIcon icon={faCartShopping} size="2x" className="me-2" />
        <div className="text-container">
          <h2 className="m-0 fw-bold">SUPERMARKET</h2>
          <small>Business Assistant</small>
        </div>
      </div>

      {/* Logo + botón cerrar en móviles */}
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
          <Link className="sidebar-link" to="/categories">
            <FontAwesomeIcon icon={faLayerGroup} />
            Categorías
          </Link>
        </li>
        <li className="nav-item">
          <Link className="sidebar-link" to="/products">
            <FontAwesomeIcon icon={faList} />
            Productos
          </Link>
        </li>
        <li className="nav-item">
          <Link className="sidebar-link" to="/lots">
            <FontAwesomeIcon icon={faTableCells} />
            Lotes
          </Link>
        </li>
        <li className="nav-item">
          <Link className="sidebar-link" to="/sales">
            <FontAwesomeIcon icon={faMoneyBillTrendUp} />
            Ventas
          </Link>
        </li>
        <li className="nav-item">
          <Link className="sidebar-link" to="/sale-details">
            <FontAwesomeIcon icon={faMoneyCheckDollar} />
            Detalles de Venta
          </Link>
        </li>
        <li className="nav-item">
          <Link className="sidebar-link" to="/reports">
            <FontAwesomeIcon icon={faNewspaper} />
            Reportes
          </Link>
        </li>
        {/* Botón de cerrar sesión */}
        <li className="nav-item">
          <button
            className="sidebar-link btn btn-link w-100 text-start"
            onClick={handleLogout}
            style={{ textDecoration: 'none' }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </aside>
  );
}
