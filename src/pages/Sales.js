// src/pages/Sales.js
import { useState, useEffect } from 'react';

// Componentes
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import SaleDetailModal from '../components/SaleDetailModal';

// Servicios
import SaleService from '../services/SalesService';
import UserService from '../services/UserService';
import SaleDetailService from '../services/SaleDetailService';

export default function Sales() {
  /** ------------------------------
   *  Estados
   *  ------------------------------ */
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);

  // Formulario
  const [selectedSale, setSelectedSale] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);

  // Confirmación
  const [showConfirm, setShowConfirm] = useState(false);

  // Detalle de venta
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState([]);

  /** ------------------------------
   *  Efectos
   *  ------------------------------ */
  useEffect(() => {
    loadSales();
    loadUsers();
  }, []);

  /** ------------------------------
   *  Carga de datos
   *  ------------------------------ */
  const loadSales = async () => {
    try {
      const res = await SaleService.getAll();
      setSales(res);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await UserService.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  

  /** ------------------------------
   *  Construcción de campos del formulario
   *  ------------------------------ */
  const buildFormFields = (sale) => [
    { name: 'total', label: 'Total', type: 'number', value: sale.total || 0 },
    { name: 'saleDate', label: 'Fecha de Venta', type: 'date', value: sale.saleDate || '' },
    {
      name: 'user',
      label: 'Usuario',
      type: 'select',
      value: sale.userId || '',
      options: users.map(u => ({ value: u.id, label: u.name }))
    }
  ];

  /** ------------------------------
   *  Handlers de CRUD
   *  ------------------------------ */
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

  const handleFieldChange = (name, value) => {
    setFormFields(prevFields =>
      prevFields.map(field => field.name === name ? { ...field, value } : field)
    );
  };

  const handleSave = async () => {

    let saleData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});


    saleData.user = { id: parseInt(saleData.user) };

    try {
      let response = {};
      if (mode === 'edit') {
        response = await SaleService.update(selectedSale.id, saleData);
        if ('message' in response) {
          alert(response.message);
        }
      } else if (mode === 'add') {
        response = await SaleService.create(saleData);
        if ('message' in response) {
          alert(response.message);
        }
      }

      await loadSales();
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar la venta:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      let response = await SaleService.delete(selectedSale.id);
      if ('message' in response) {
        alert(response.message);
      }
      await loadSales();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    }
  };

  /** ------------------------------
   *  Detalle de ventas
   *  ------------------------------ */
  const handleViewDetails = async (saleId) => {
    try {
      const details = await SaleDetailService.getBySaleId(saleId); 
      setDetailData(details);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error al obtener detalles de la venta:", error);
    }
  };

  /** ------------------------------
   *  Cabeceras de tabla
   *  ------------------------------ */
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'saleDate', label: 'Fecha de Venta' },
    { key: 'total', label: 'Total' },
    { key: 'userName', label: 'Usuario' },
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

  /** ------------------------------
   *  Render
   *  ------------------------------ */
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Ventas" />
        <AddButton label="Agregar Venta" onClick={handleAdd} />
      </div>

      <ListTable
        headers={tableHeaders}
        data={sales}
        accordionHeaderKey={(item) => `${item.id} - ${item.saleDate}`}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
        message={`¿Está seguro que desea eliminar la venta del ${selectedSale?.saleDate}?`}
      />

      <SaleDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        details={detailData}
      />
    </div>
  );
}
