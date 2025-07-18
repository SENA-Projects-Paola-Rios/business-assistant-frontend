// Botón reutilizable para agregar registros (usuarios, categorías, productos, ventas, etc.)

export default function AddButton({ label, onClick }) {
  return (
    <button className="btn btn-primary mb-3 float-end" onClick={onClick}>
      {label}
    </button>
  );
}