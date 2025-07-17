export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <h2>Bienvenido {user?.username || 'Invitado'}</h2>
      <p>Este es tu panel de inicio.</p>
    </div>
  );
}
