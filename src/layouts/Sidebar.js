import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="bg-light p-3" style={{ minHeight: '100vh' }}>
      <ul className="nav flex-column">
        <li className="nav-item"><Link className="nav-link" to="/dashboard">Inicio</Link></li>
      </ul>
    </aside>
  );
}
