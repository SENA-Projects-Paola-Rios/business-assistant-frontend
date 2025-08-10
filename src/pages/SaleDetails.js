import { useState, useEffect } from 'react';

// Componentes
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';

// Servicios
import SaleDetailService from '../services/SaleDetailService';
import SalesService from '../services/SalesService';
import LotService from '../services/LotService';

export default function SaleDetails() {
  /** ------------------------------
   *  Estados
   *  ------------------------------ */
  const [details, setDetails] = useState([]);
  const [lots, setLots] = useState([]);
  const [sales, setSales] = useState([]);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [mode, setMode] = useState('view');

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /** ------------------------------
   *  Efectos
   *  ------------------------------ */
  useEffect(() => {
    loadDetails();
    loadLots();
    loadSales();
  }, []);

  /** ------------------------------
   *  Carga de datos
   *  ------------------------------ */
  const loadDetails = async () => {
    try {
      let res = await SaleDetailService.getAll();

      let resWithSubtotal = res.map(item => ({
          ...item,
          subtotal: item.quantity * item.productPrice
      }));

      setDetails(resWithSubtotal);
    } catch (error) {
      console.error('Error al cargar detalles de venta:', error);
    }
  };

  const loadLots = async () => {
    try {
      const res = await LotService.getAll();
      setLots(res);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
    }
  };

  const loadSales = async () => {
    try {
      const res = await SalesService.getAll();
      setSales(res);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  /** ------------------------------
   *  Configuración de tabla
   *  ------------------------------ */
  const tableHeaders = [
    { key: 'saleId', label: 'ID Venta' },
    { key: 'lotId', label: 'Código Lote' },
    { key: 'productName', label: 'Producto' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'productPrice', label: 'Precio Unitario' },
    { key: 'subtotal', label: 'Subtotal' },
  ];

  /** ------------------------------
   *  Helper: construcción de formulario
   *  ------------------------------ */
  const buildFormFields = async (detail) => {
    try {
      // Obtener el lote de forma asíncrona
      let unitPrice = 0;
      let subtotal = 0;
      let lot = {}
      if(detail.lotId != ''){
        lot = await LotService.getById(parseInt(detail.lotId));
        unitPrice = lot?.productPrice || 0;
        subtotal = (detail.quantity || 0) * unitPrice;
      }
      

      return [
        {
          name: 'saleId',
          label: 'ID Venta',
          type: 'select',
          value: detail.saleId || '',
          options: sales.map(s => ({
            value: s.id,
            label: `${s.saleDate}`
          }))
        },
        {
          name: 'lotId',
          label: 'Lote',
          type: 'select',
          value: detail.lotId || '',
          options: lots.map(l => ({
            value: l.id,
            label: `${l.manufacturerLot} (${l.productName})`
          }))
        },
        { name: 'quantity', label: 'Cantidad', type: 'number', value: detail.quantity || 1 },
        /*{
          name: 'unit_price',
          label: 'Precio Unitario',
          type: 'number',
          value: unitPrice,
          attributes: { readOnly: true, tabIndex: -1, style: { pointerEvents: 'none', backgroundColor: '#f9f9f9' } }
        },
        {
          name: 'subtotal',
          label: 'Subtotal',
          type: 'number',
          value: subtotal,
          attributes: { readOnly: true, tabIndex: -1, style: { pointerEvents: 'none', backgroundColor: '#f9f9f9' } }
        }*/
      ];
    } catch (error) {
      console.error("Error al construir los campos del formulario:", error);

      return [
        {
          name: 'saleId',
          label: 'ID Venta',
          type: 'select',
          value: detail.saleId || '',
          options: sales.map(s => ({
            value: s.id,
            label: `${s.saleDate}`
          }))
        },
        {
          name: 'lotId',
          label: 'Lote',
          type: 'select',
          value: detail.lot_id || '',
          options: lots.map(l => ({
            value: l.id,
            label: `${l.manufacturerLot} (${l.productName})`
          }))
        },
        { name: 'quantity', label: 'Cantidad', type: 'number', value: detail.quantity || 1 },
      ];
    }
  };


  /** ------------------------------
   *  Handlers de CRUD
   *  ------------------------------ */
  const handleView = async (detail) => {
    setSelectedDetail(detail);
    
    const fields = await buildFormFields(detail);
    setFormFields(fields);
    
    setMode('view');
    setShowForm(true);
  };

  const handleEdit = async (detail) => {

    const updated = { ...detail, unit_price: detail.productPrice || 0 };

    setSelectedDetail(detail);
    
    const fields = await buildFormFields(updated);
    setFormFields(fields);
    
    setMode('edit');
    setShowForm(true);
  };

  const handleAdd = async () => {
    let emptyDetail = { saleId: '', lotId: '', quantity: 1 };
    setSelectedDetail(emptyDetail);
    
    const fields = await buildFormFields(emptyDetail);
    setFormFields(fields);
    
    setMode('add');
    setShowForm(true);
  };

  const handleDelete = (detail) => {
    setSelectedDetail(detail);
    setShowConfirm(true);
  };

  /** ------------------------------
   *  Manejo de cambios en el formulario
   *  ------------------------------ */
  const handleFieldChange = (name, value) => {
    setFormFields(prev => {
      let updated = prev.map(f => (f.name === name ? { ...f, value } : f));

      if (name === 'lot_id') {
        const selectedLot = LotService.getById(parseInt(value));
        const newUnitPrice = selectedLot?.unit_price || 0;
        updated = updated.map(f => f.name === 'unit_price' ? { ...f, value: newUnitPrice } : f);
      }

      const quantity = parseFloat(updated.find(f => f.name === 'quantity')?.value || 0);
      const unitPrice = parseFloat(updated.find(f => f.name === 'unit_price')?.value || 0);
      const subtotal = quantity * unitPrice;

      return updated.map(f => f.name === 'subtotal' ? { ...f, value: subtotal } : f);
    });
  };

  /** ------------------------------
   *  Guardar detalle de venta
   *  ------------------------------ */
  const handleSave = async () => {

    let formData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    const detailData = {
      id: {
        saleId: parseInt(formData.saleId),
        lotId: parseInt(formData.lotId),
      },
      sale: {
        id: parseInt(formData.saleId),
      },
      lot: {
        id: parseInt(formData.lotId),
      },
      quantity: parseFloat(formData.quantity),
    };

    try {
      let response = {};
      if (mode === 'edit') {
        response = await SaleDetailService.create(detailData);
        if ('message' in response) {
          alert(response.message);
        }
      } else if (mode === 'add') {
        response = await SaleDetailService.create(detailData);
        if ('message' in response) {
          alert(response.message);
        }
      }

      await loadDetails(); 
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar detalle de venta:', error);
    }
  };

  /** ------------------------------
   *  Confirmar eliminación
   *  ------------------------------ */
  const confirmDelete = async () => {
    try {
      let response = await SaleDetailService.delete(
        selectedDetail.sale_id,
        selectedDetail.lot_id
      );
      if ('message' in response) {
        alert(response.message);
      }
      await loadDetails(); // Asegúrate de tener esta función definida
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al eliminar detalle de venta:', error);
    }
  };

  /** ------------------------------
   *  Render
   *  ------------------------------ */
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Detalles de Venta" />
        <AddButton label="Agregar Detalle" onClick={handleAdd} />
      </div>

      <ListTable
        headers={tableHeaders}
        data={details}
        accordionHeaderKey={(item) => `${item.sale_id} - ${item.lot_code}`}
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
        message={`¿Está seguro que desea eliminar el lote ${selectedDetail?.lot_code} de la venta ${selectedDetail?.sale_id}?`}
      />
    </div>
  );
}
