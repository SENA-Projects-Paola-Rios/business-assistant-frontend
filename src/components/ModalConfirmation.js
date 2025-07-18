// Este componente representa un modal de confirmación genérico, se usa para acciones importantes como eliminar

export default function ModalConfirmation({ show, onConfirm, onCancel, message }) {

  // Si la prop show es falsa, no se renderiza nada y el modal no aparece
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmación</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>

        {/* Cuerpo del modal donde se muestra el mensaje que se recibe por props */}
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button className="btn btn-danger" onClick={onConfirm}>Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
