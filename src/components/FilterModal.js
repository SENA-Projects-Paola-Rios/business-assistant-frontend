// Componente para agregar filtro de fechas a los reportes

import { useState } from 'react';
import '../styles/FilterModal.css';

const FilterModal = ({ onClose, onApply }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    const filters = {
      startDate,
      endDate,
    };
    onApply(filters);
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <h3>Agregar filtros</h3>
        <label>Fecha de inicio:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>Fecha de fin:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <div className="filter-modal-buttons">
          <button className='applyButton' onClick={handleApply}>Aplicar</button>
          <button className='cancelButton' onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
