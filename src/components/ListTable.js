import ActionButtons from './ActionButtons';

/**
 * Componente de tabla reutilizable y dinámico.
 * @param {Array} headers - Arreglo de objetos { key, label } para definir columnas.
 * @param {Array} data - Datos a renderizar en la tabla.
 * @param {Function} onView - Función para ver un registro.
 * @param {Function} onEdit - Función para editar un registro.
 * @param {Function} onDelete - Función para eliminar un registro.
 */
export default function ListTable({ headers, data, onView, onEdit, onDelete }) {
  return (
    <table className="table table-striped">
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
  );
}
