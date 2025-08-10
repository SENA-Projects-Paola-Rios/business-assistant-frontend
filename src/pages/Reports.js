import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import CustomSelect from '../components/CustomSelect';
import FilterModal from '../components/FilterModal';
import ReportService from '../services/ReportService';
import '../styles/Reports.css';

const Reports = () => {
  const [selectedReportSlug, setSelectedReportSlug] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState(null);

  // Guardamos los reportes completos para tener acceso a 'fields'
  const [reportOptions, setReportOptions] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await ReportService.getAll();
        setReportOptions(reports);
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      }
    };
    fetchReports();
  }, []);

  // Busca el reporte seleccionado completo (objeto)
  const selectedReport = reportOptions.find(r => r.slug === selectedReportSlug);

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert('Seleccione un reporte válido');
      return;
    }
    alert(`Generando reporte: ${selectedReport.slug}`);

    if (filters) {
      console.log('Con filtros:', filters);
    }
  };

  const handleOpenFilterModal = () => {
    if (!selectedReport) {
      alert('Por favor seleccione un reporte antes de agregar filtros.');
      return;
    }
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    setShowFilterModal(false);
  };

  return (
    <div className="reports-container">
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Reportes" />
      </div>
      <div className="reports-content">
        <CustomSelect
          options={reportOptions.map(r => ({
            value: r.slug,
            label: r.name,
          }))}
          value={selectedReportSlug}
          onChange={setSelectedReportSlug}
          placeholder="Seleccione un reporte"
        />

        <div className="reports-buttons">
          <button className="btn-filter" onClick={handleOpenFilterModal} disabled={!selectedReportSlug}>
            Continuar
          </button>
        </div>
      </div>

      {showFilterModal && selectedReport && (
        <FilterModal
          onClose={handleCloseFilterModal}
          onApply={handleApplyFilters}
          fields={selectedReport.fields}
          slug={selectedReport.slug}
        />
      )}
    </div>
  );
};

export default Reports;
