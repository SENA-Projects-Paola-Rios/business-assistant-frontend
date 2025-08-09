import { useState } from 'react';
import ActionButtons from './ActionButtons';
import '../styles/ListTable.css';  // Importamos los estilos externos

/**
 * Componente de tabla reutilizable y dinámico.
 * @param {Array} headers - Arreglo de objetos { key, label, render? } para definir columnas.
 * @param {Array} data - Datos a renderizar en la tabla.
 * @param {Function} onView - Función para ver un registro.
 * @param {Function} onEdit - Función para editar un registro.
 * @param {Function} onDelete - Función para eliminar un registro.
 * @param {string} accordionHeaderKey - Clave del campo que se usará como título del acordeón en móviles.
 */
export default function ListTable({ headers, data, onView, onEdit, onDelete, accordionHeaderKey }) {
  // Estado para controlar qué item está expandido en el acordeón (para móviles)
  const [openItem, setOpenItem] = useState(null);


  // Alternar el item abierto o cerrado
  const toggleAccordion = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  // Evitamos romper si headers o data vienen nulos/undefined
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div>
      {/* Tabla tradicional para pantallas medianas y grandes */}
      <table className="table table-striped table-custom d-none d-md-table">
        <thead>
          <tr>
            {safeHeaders.map((header, idx) => (
              <th key={idx}>{header.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {safeData.map((item) => (
            <tr key={item.id || item.key}>
              {safeHeaders.map((header, idx) => (
                <td key={idx}>
                  {header.render ? header.render(item) : item[header.key]}
                </td>
              ))}
              <td>
                <ActionButtons
                  onView={() => onView(item)}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Acordeón para pantallas pequeñas */}
      <div className="d-md-none">
        {safeData.map((item) => (
          <div className="card mb-2" key={item.id || item.key}>
            <div
              className="card-header accordion-header d-flex justify-content-between align-items-center"
              onClick={() => toggleAccordion(item.id)}
            >
              <span>
                {typeof accordionHeaderKey === 'function'
                  ? accordionHeaderKey(item)
                  : item[accordionHeaderKey]}
              </span>
              <span className="accordion-toggle">{openItem === item.id ? '▲' : '▼'}</span>
            </div>
            {openItem === item.id && (
              <div className="card-body accordion-body p-2">
                {safeHeaders.map((header, idx) => (
                  <p key={idx}>
                    <strong>{header.label}:</strong> {header.render ? header.render(item) : item[header.key]}
                  </p>
                ))}
                <div className="accordion-actions">
                  <strong>Acciones:</strong>
                  <div>
                    <ActionButtons
                      onView={() => onView(item)}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
