import { useState, useEffect } from 'react';
import '../styles/FilterModal.css';
import ReportService from '../services/ReportService'; // importa el servicio

const FilterModal = ({ onClose, onApply, fields = '', slug }) => {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (!fields) return;

    const newFormValues = {};
    fields.split('|').forEach(fieldStr => {
      const [type, id, placeholder] = fieldStr.split(':');
      if (id) newFormValues[id] = '';
    });

    setFormValues(newFormValues);
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = async () => {
    try {
      // Llamar a generate con slug y formValues
      const response = await ReportService.generate(slug, formValues);

      // Suponemos que response es un Blob con CSV
      // Crear link para descargar el CSV
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Nombre archivo puede ser slug + fecha
      const now = new Date();
      const filename = `${slug}_${now.toISOString().slice(0,10)}.csv`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      onApply(formValues);  // Pasar los filtros si quieres hacer algo más
      onClose();
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte. Intente nuevamente.');
    }
  };

  if (!fields) return null;

  const fieldsArray = fields.split('|');

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <h3>Agregar filtros</h3>

        {fieldsArray.map((fieldStr, idx) => {
          const [type, id, placeholder] = fieldStr.split(':');
          if (!id) return null;

          return (
            <div key={idx} className="filter-field">
              <label htmlFor={id}>{placeholder}</label>
              <input
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                value={formValues[id] || ''}
                onChange={handleChange}
              />
            </div>
          );
        })}

        <div className="filter-modal-buttons">
          <button className="applyButton" onClick={handleApply}>Generar</button>
          <button className="cancelButton" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
