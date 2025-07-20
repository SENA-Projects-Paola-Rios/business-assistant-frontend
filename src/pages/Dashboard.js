import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="text-center mt-5">
      <FontAwesomeIcon icon={faShoppingCart} size="4x" className="mb-3" />
      <h2 className="fw-bold">BUSINESS ASSISTANT SUPERMARKET</h2>
      <p className="mt-3 mx-auto" style={{ maxWidth: '400px' }}>
        Bienvenido <strong>{user?.username || 'Invitado'}</strong> a la aplicación <strong>Business Assistant Supermarket</strong>, que busca facilitar la gestión eficiente de inventarios y ventas en supermercados, aquí podrás llevar un control de tu negocio de manera segura y ordenada.
      </p>
    </div>
  );
}
