import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import SaleDetailService from '../services/SaleDetailService';
import LotService from '../services/LotService';

export default function SaleDetails() {
  const [details, setDetails] = useState(SaleDetailService.getAll());
  const [lots] = useState(LotService.getAll());

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  // Encabezados de la tabla de detalles de venta
  const tableHeaders = [
    { key: 'sale_id', label: 'ID Venta' },
    { key: 'lot_code', label: 'Código Lote' },
    { key: 'product_name', label: 'Producto' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'unit_price', label: 'Precio Unitario' },
    { key: 'subtotal', label: 'Subtotal' },
  ];

  // Construye los campos del formulario, asegurando que unit_price venga del lote
  const buildFormFields = (detail) => {
    const lot = LotService.getById(parseInt(detail.lot_id));
    const unitPrice = lot?.unit_price || 0;
    const subtotal = (detail.quantity || 0) * unitPrice;

    return [
      {
        name: 'sale_id',
        label: 'ID Venta',
        type: 'number',
        value: detail.sale_id || ''
      },
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
      {
        name: 'quantity',
        label: 'Cantidad',
        type: 'number',
        value: detail.quantity || 1
      },
      {
        name: 'unit_price',
        label: 'Precio Unitario',
        type: 'number',
        value: unitPrice,
        attributes: {
          readOnly: true,
          tabIndex: -1,
          style: {
            pointerEvents: 'none',
            backgroundColor: '#f9f9f9'
          }
        }
      },
      {
        name: 'subtotal',
        label: 'Subtotal',
        type: 'number',
        value: subtotal,
        attributes: {
          readOnly: true,
          tabIndex: -1,
          style: {
            pointerEvents: 'none',
            backgroundColor: '#f9f9f9'
          }
        }
      }
    ];
  };

  // Ver detalle en modo solo lectura
  const handleView = (detail) => {
    const updatedDetail = {
      ...detail,
      unit_price: LotService.getById(parseInt(detail.lot_id))?.unit_price || 0
    };
    setSelectedDetail(detail);
    setFormFields(buildFormFields(updatedDetail));
    setMode('view');
    setShowForm(true);
  };

  // Editar detalle, asegurando precio correcto
  const handleEdit = (detail) => {
    const updatedDetail = {
      ...detail,
      unit_price: LotService.getById(parseInt(detail.lot_id))?.unit_price || 0
    };
    setSelectedDetail(detail);
    setFormFields(buildFormFields(updatedDetail));
    setMode('edit');
    setShowForm(true);
  };

  // Agregar nuevo detalle de venta
  const handleAdd = () => {
    const emptyDetail = { sale_id: '', lot_id: '', quantity: 1 };
    setSelectedDetail(emptyDetail);
    setFormFields(buildFormFields(emptyDetail));
    setMode('add');
    setShowForm(true);
  };

  // Eliminar un detalle
  const handleDelete = (detail) => {
    setSelectedDetail(detail);
    setShowConfirm(true);
  };

  // Manejo de cambios en los campos del formulario
  const handleFieldChange = (name, value) => {
    setFormFields(prev => {
      let updated = prev.map(f =>
        f.name === name ? { ...f, value } : f
      );

      // Si cambia el lote, actualizar unit_price
      if (name === 'lot_id') {
        const selectedLot = LotService.getById(parseInt(value));
        const newUnitPrice = selectedLot?.unit_price || 0;

        updated = updated.map(f => {
          if (f.name === 'unit_price') return { ...f, value: newUnitPrice };
          return f;
        });
      }

      // Recalcular subtotal con los valores actuales
      const quantity = parseFloat(updated.find(f => f.name === 'quantity')?.value || 0);
      const unitPrice = parseFloat(updated.find(f => f.name === 'unit_price')?.value || 0);
      const subtotal = quantity * unitPrice;

      updated = updated.map(f =>
        f.name === 'subtotal' ? { ...f, value: subtotal } : f
      );

      return updated;
    });
  };

  // Guardar nuevo o editar detalle de venta
  const handleSave = () => {
    const formData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    // Traer información actual del lote seleccionado
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

  // Confirmar y ejecutar eliminación
  const confirmDelete = () => {
    SaleDetailService.delete(selectedDetail.sale_id, selectedDetail.lot_id);
    setDetails(SaleDetailService.getAll());
    setShowConfirm(false);
  };

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
