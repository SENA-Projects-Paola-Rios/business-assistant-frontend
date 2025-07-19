// Botones de acción para cada fila de la tabla: Ver, Editar y Eliminar

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashCan} from '@fortawesome/free-solid-svg-icons'; 
import '../styles/ActionButtons.css';

export default function ActionButtons({ onView, onEdit, onDelete }) {
  return (
    <div className="d-flex gap-2">
      <button
        onClick={onView}
        className="btn btn-link p-0"
        title="Ver"
        aria-label="Ver"
      >
        <FontAwesomeIcon icon={faEye} className="icon-eye" />
      </button>

      <button
        onClick={onEdit}
        className="btn btn-link p-0"
        title="Editar"
        aria-label="Editar"
      >
        <FontAwesomeIcon icon={faEdit} className="icon-edit" />
      </button>

      <button
        onClick={onDelete}
        className="btn btn-link p-0"
        title="Eliminar"
        aria-label="Eliminar"
      >
        <FontAwesomeIcon icon={faTrashCan} className="icon-delete" />
      </button>
    </div>
  );
}