// componente para el selector de tipo de reporte

import '../styles/CustomSelect.css';

const CustomSelect = ({ options, value, onChange }) => {
  return (
    <select className="custom-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Seleccione un reporte</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
