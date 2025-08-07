import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import CustomSelect from '../components/CustomSelect';
import FilterModal from '../components/FilterModal';
import '../styles/Reports.css';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

    // Estado para almacenar los filtros aplicados
  const [filters, setFilters] = useState(null);

const handleGenerateReport = () => {
  const selectedOption = reportOptions.find(option => option.value === selectedReport);
  const reportLabel = selectedOption ? selectedOption.label : 'Reporte no seleccionado';

  alert(`Generando reporte: ${reportLabel}`);

  if (filters) {
    console.log('Con filtros:', filters);
  }
};

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    setShowFilterModal(false);
  };

  // Lista de opciones de reportes disponibles
  const reportOptions = [
    { value: 'sales', label: 'Reporte de Ventas' },
    { value: 'top-products', label: 'Reporte de productos más vendidos' },
    { value: 'expiring-products', label: 'Reporte de productos próximos a vencer' },
  ];

  return (
    <div className="reports-container">
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Reportes" />
      </div>
      <div className="reports-content">
        <CustomSelect
          options={reportOptions}
          value={selectedReport}
          onChange={setSelectedReport}
        />

        <div className="reports-buttons">
          <button className="btn-filter" onClick={handleOpenFilterModal}>
            Agregar filtros
          </button>
          <button className="btn-generate" onClick={handleGenerateReport}>
            Generar Reporte
          </button>
        </div>
      </div>

      {showFilterModal && (
        <FilterModal onClose={handleCloseFilterModal} onApply={handleApplyFilters} />
      )}
    </div>
  );
};

export default Reports;
