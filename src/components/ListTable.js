import { useState } from 'react';
import ActionButtons from './ActionButtons';
import '../styles/ListTable.css';  // Importamos los estilos externos

/**
 * Componente de tabla reutilizable y dinámico.
 * @param {Array} headers - Arreglo de objetos { key, label } para definir columnas.
 * @param {Array} data - Datos a renderizar en la tabla.
 * @param {Function} onView - Función para ver un registro.
 * @param {Function} onEdit - Función para editar un registro.
 * @param {Function} onDelete - Función para eliminar un registro.
 */
export default function ListTable({ headers, data, onView, onEdit, onDelete }) {
  // Estado para controlar qué item está expandido en el acordeón (para móviles)
  const [openItem, setOpenItem] = useState(null);

  // Alternar el item abierto o cerrado
  const toggleAccordion = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div>
      {/* Tabla tradicional para pantallas medianas y grandes */}
      <table className="table table-striped table-custom d-none d-md-table">
        <thead>
          <tr>
            {/* Generamos cada encabezado según la propiedad 'label' definida en headers */}
            {headers.map((header, idx) => (
              <th key={idx}>{header.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id || item.key}>
              {/* Renderizamos dinámicamente cada valor del objeto usando la 'key' definida en headers */}
              {headers.map((header, idx) => (
                <td key={idx}>{item[header.key]}</td>
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
        {data.map((item) => (
          <div className="card mb-2" key={item.id || item.key}>
            {/* Cabecera clickeable del acordeón */}
            <div
              className="card-header accordion-header d-flex justify-content-between align-items-center"
              onClick={() => toggleAccordion(item.id)}
            >
              {/* Personalizamos el encabezado del acordeón*/}
              <span>{item.email}</span>
              <span className="accordion-toggle">{openItem === item.id ? '▲' : '▼'}</span>
            </div>

            {/* Si el item es el seleccionado, mostramos su contenido */}
            {openItem === item.id && (
              <div className="card-body accordion-body p-2">
                {/* Renderizamos los campos dinámicamente */}
                {headers.map((header, idx) => (
                  <p key={idx}>
                    <strong>{header.label}:</strong> {item[header.key]}
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
