import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; 
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../styles/Layout.css';

export default function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);  // controla visibilidad del sidebar en móvil
  const [darkMode, setDarkMode] = useState(false);              // controla modo claro/oscuro

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? 'dark-mode' : 'light-mode'} d-flex flex-column min-vh-100`}>
      <Header onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        <div className={`sidebar-wrapper ${sidebarVisible ? 'show' : ''}`}>
          <Sidebar onClose={closeSidebar} />
        </div>

        <main className="layout-content flex-grow-1">
          {/* Botón circular para cambiar entre modo claro y oscuro */}
          <div className="d-flex justify-content-end mb-3">
            <button
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              aria-label="Cambiar modo claro/oscuro"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>

          {/* Contenido dinámico */}
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
