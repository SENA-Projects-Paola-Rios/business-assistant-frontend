// Botones de acción para cada fila de la tabla: Ver, Editar y Eliminar

export default function ActionButtons({ onView, onEdit, onDelete }) {
  return (
    <div className="btn-group">
      <button className="btn btn-info btn-sm" onClick={onView}>Ver</button>
      <button className="btn btn-warning btn-sm" onClick={onEdit}>Editar</button>
      <button className="btn btn-danger btn-sm" onClick={onDelete}>Eliminar</button>
    </div>
  );
}