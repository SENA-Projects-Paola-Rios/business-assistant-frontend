import { useState } from 'react';

// Componentes
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';

// Servicios
import SaleDetailService from '../services/SaleDetailService';
import LotService from '../services/LotService';

export default function SaleDetails() {
  /** ------------------------------
   *  Estados
   *  ------------------------------ */
  const [details, setDetails] = useState(SaleDetailService.getAll());
  const [lots] = useState(LotService.getAll());

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [mode, setMode] = useState('view');

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /** ------------------------------
   *  Configuración de tabla
   *  ------------------------------ */
  const tableHeaders = [
    { key: 'sale_id', label: 'ID Venta' },
    { key: 'lot_code', label: 'Código Lote' },
    { key: 'product_name', label: 'Producto' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'unit_price', label: 'Precio Unitario' },
    { key: 'subtotal', label: 'Subtotal' },
  ];

  /** ------------------------------
   *  Helper: construcción de formulario
   *  ------------------------------ */
  const buildFormFields = (detail) => {
    const lot = LotService.getById(parseInt(detail.lot_id));
    const unitPrice = lot?.unit_price || 0;
    const subtotal = (detail.quantity || 0) * unitPrice;

    return [
      { name: 'sale_id', label: 'ID Venta', type: 'number', value: detail.sale_id || '' },
      {
        name: 'lot_id',
        label: 'Lote',
        type: 'select',
        value: detail.lot_id || '',
        options: lots.map(l => ({
          value: l.id,
          label: `${l.manufacturer_lot} (${l.product_name})`
        }))
      },
      { name: 'quantity', label: 'Cantidad', type: 'number', value: detail.quantity || 1 },
      {
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
      }
    ];
  };

  /** ------------------------------
   *  Handlers de CRUD
   *  ------------------------------ */
  const handleView = (detail) => {
    const updated = { ...detail, unit_price: LotService.getById(parseInt(detail.lot_id))?.unit_price || 0 };
    setSelectedDetail(detail);
    setFormFields(buildFormFields(updated));
    setMode('view');
    setShowForm(true);
  };

  const handleEdit = (detail) => {
    const updated = { ...detail, unit_price: LotService.getById(parseInt(detail.lot_id))?.unit_price || 0 };
    setSelectedDetail(detail);
    setFormFields(buildFormFields(updated));
    setMode('edit');
    setShowForm(true);
  };

  const handleAdd = () => {
    const emptyDetail = { sale_id: '', lot_id: '', quantity: 1 };
    setSelectedDetail(emptyDetail);
    setFormFields(buildFormFields(emptyDetail));
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
   *  Guardar cambios
   *  ------------------------------ */
  const handleSave = () => {
    const formData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    const lot = LotService.getById(parseInt(formData.lot_id));
    const unitPrice = lot?.unit_price || 0;

    const detailData = {
      sale_id: parseInt(formData.sale_id),
      lot_id: parseInt(formData.lot_id),
      quantity: parseFloat(formData.quantity),
      unit_price: unitPrice,
      subtotal: parseFloat(formData.quantity) * unitPrice,
      lot_code: lot?.manufacturer_lot || '',
      product_name: lot?.product_name || '',
    };

    if (mode === 'edit') {
      SaleDetailService.update(selectedDetail.sale_id, selectedDetail.lot_id, detailData);
    } else {
      SaleDetailService.create(detailData);
    }

    setDetails(SaleDetailService.getAll());
    setShowForm(false);
  };

  /** ------------------------------
   *  Confirmar eliminación
   *  ------------------------------ */
  const confirmDelete = () => {
    SaleDetailService.delete(selectedDetail.sale_id, selectedDetail.lot_id);
    setDetails(SaleDetailService.getAll());
    setShowConfirm(false);
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
