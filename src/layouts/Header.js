/**
 * Componente Header que aparece solo en pantallas pequeñas.
 * Contiene el botón hamburguesa para abrir el sidebar.
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header d-flex justify-content-between align-items-center d-md-none">
      <div className="app-logo d-flex align-items-center">
        <FontAwesomeIcon icon={faCartShopping} size="2x" className="me-2" />
        <div className="text-container">
          <h2 className="m-0 fs-5">SUPERMARKET</h2>
          <small>Business Assistant</small>
        </div>
      </div>

      <button
        className="theme-toggle"
        onClick={onToggleSidebar}
        aria-label="Abrir menú"
      >
        &#9776;
      </button>
    </header>
  );
}