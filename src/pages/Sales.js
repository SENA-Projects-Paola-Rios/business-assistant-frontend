import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import SaleDetailModal from '../components/SaleDetailModal';
import SaleService from '../services/SalesService';
import UserService from '../services/UserService';
import SaleDetailService from '../services/SaleDetailService';


export default function Sales() {
  // Estado para almacenar la lista de ventas
  const [sales, setSales] = useState([]);

  // Estado para la lista de usuarios (cargada una sola vez)
  const [users] = useState(UserService.getAll());

  // Estados relacionados con el formulario
  const [selectedSale, setSelectedSale] = useState(null); 
  const [mode, setMode] = useState('view'); 
  const [showForm, setShowForm] = useState(false); 
  const [formFields, setFormFields] = useState([]); 

  // Estados relacionados con la confirmación de eliminación
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados para el modal de detalle de la venta
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState([]); // Detalles de la venta

  // Carga todas las ventas desde el servicio y actualiza el estado
  const loadSales = () => {
    setSales(SaleService.getAll());
  };

  // Efecto que carga las ventas una vez al montar el componente
  useEffect(() => {
    loadSales();
  }, []);

  // Cabeceras de la tabla, incluyendo un botón personalizado para ver detalles
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'sale_date', label: 'Fecha de Venta' },
    { key: 'total', label: 'Total' },
    { key: 'user_name', label: 'Usuario' },
    {
      key: 'detalle_btn',
      label: 'Detalle',
      render: (sale) => (
        <button
          className="btn btn-outline-info btn-sm"
          onClick={() => handleViewDetails(sale.id)}
        >
          Ver Detalles
        </button>
      )
    }
  ];

  // Construye dinámicamente los campos del formulario a partir de una venta
  const buildFormFields = (sale) => [
    { name: 'sale_date', label: 'Fecha de Venta', type: 'date', value: sale.sale_date || '' },
    {
      name: 'user_id',
      label: 'Usuario',
      type: 'select',
      value: sale.user_id || '',
      options: users.map(u => ({ value: u.id, label: u.nombre }))
    }
  ];

  const handleView = (sale) => {
    setSelectedSale(sale);
    setFormFields(buildFormFields(sale));
    setMode('view');
    setShowForm(true);
  };

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setFormFields(buildFormFields(sale));
    setMode('edit');
    setShowForm(true);
  };

  const handleAdd = () => {
    const emptySale = { sale_date: '', user_id: '' };
    setSelectedSale(emptySale);
    setFormFields(buildFormFields(emptySale));
    setMode('add');
    setShowForm(true);
  };

  const handleDelete = (sale) => {
    setSelectedSale(sale);
    setShowConfirm(true);
  };

  // Maneja cambios en los campos del formulario
  const handleFieldChange = (name, value) => {
    setFormFields(prevFields =>
      prevFields.map(field => field.name === name ? { ...field, value } : field)
    );
  };

  const handleSave = () => {
    // Convierte los campos del formulario a un objeto plano
    const saleData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    // Convierte el user_id a número y agrega el nombre del usuario
    saleData.user_id = parseInt(saleData.user_id);
    const user = users.find(u => u.id === saleData.user_id);
    saleData.user_name = user?.nombre || '';

    if (mode === 'edit') {
      SaleService.update(selectedSale.id, saleData);
    } else if (mode === 'add') {
      SaleService.create(saleData);
    }

    loadSales();
    setShowForm(false);
  };

  const confirmDelete = () => {
    SaleService.delete(selectedSale.id);
    loadSales();
    setShowConfirm(false);
  };

  // Carga y muestra los detalles de una venta en un modal
  const handleViewDetails = (saleId) => {
    const details = SaleDetailService.getBySaleId(saleId);
    setDetailData(details);
    setShowDetailModal(true);
  };

  // Render del componente
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Ventas" />
        <AddButton label="Agregar Venta" onClick={handleAdd} />
      </div>

      {/* Tabla de ventas con acordeón para móviles */}
      <ListTable
        headers={tableHeaders}
        data={sales}
        accordionHeaderKey={(item) => `${item.id} - ${item.sale_date}`} // Encabezado del acordeón personalizado
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de formulario para agregar, editar o ver venta */}
      <ModalForm
        show={showForm}
        onClose={() => setShowForm(false)}
        mode={mode}
        fields={formFields}
        onChange={handleFieldChange}
        onSave={handleSave}
      />

      <ModalConfirmation
        show={showConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        message={`¿Está seguro que desea eliminar la venta del ${selectedSale?.sale_date}?`}
      />

      <SaleDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        details={detailData}
      />
    </div>
  );
}
