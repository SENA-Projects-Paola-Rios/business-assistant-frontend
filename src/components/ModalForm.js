import '../styles/ModalForm.css';  

// Este componente genera un modal reutilizable para crear, editar o ver registros
export default function ModalForm({ show, onClose, mode, fields, onChange, onSave }) {

  // Si la prop show es falsa, el modal no se muestra (retorna null y no renderiza nada)
  if (!show) return null;

  // Definimos un título que cambia dependiendo del modo en que estamos
  const title = {
    view: 'Detalles',          // si es modo vista
    edit: 'Editar',            // si es modo edición
    add: 'Nuevo Registro'      // si es modo agregar
  }[mode]; // seleccionamos el valor correspondiente al modo actual

  return (
    <div className="custom-modal-backdrop">
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {mode === 'view' ? (
                // Si el modo es 'view', mostramos los campos como texto (sin inputs)
                <div>
                  {fields.map((field, idx) => (
                    <p key={idx}><strong>{field.label}:</strong> {field.value}</p>
                  ))}
                </div>
              ) : (
                // Si el modo es 'edit' o 'add', renderizamos un formulario editable
                <form>
                  {fields.map((field, idx) => {
                    const inputId = `modal-field-${field.name}-${idx}`;
                    return (
                      <div className="mb-3" key={idx}>
                        <label className="form-label" htmlFor={inputId}>{field.label}</label>

                        {field.type === 'select' ? (
                          // Renderizado de campos tipo select (menú desplegable)
                          <select
                            id={inputId}
                            className="form-control"
                            value={field.value}
                            onChange={(e) => onChange(field.name, e.target.value)}
                          >
                            <option value="">Seleccione...</option>
                            {field.options.map((opt, i) => (
                              <option key={i} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          // Renderizado de campos tipo texto, número, fecha, etc.
                          <input
                            id={inputId}
                            type={field.type}
                            className="form-control"
                            value={field.value}
                            onChange={(e) => onChange(field.name, e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              {/* Si NO estamos en modo vista, mostramos el botón de guardar */}
              {mode !== 'view' && <button className="btn btn-primary" onClick={onSave}>Guardar</button>}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
