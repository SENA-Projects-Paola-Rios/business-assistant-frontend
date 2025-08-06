import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import LotService from '../services/LotService';
import ProductService from '../services/ProductService';

// Componente principal para la gestión de lotes
export default function Lots() {
  
  const [lots, setLots] = useState(LotService.getAll());
  const [products] = useState(ProductService.getAll());
  const [selectedLot, setSelectedLot] = useState(null);
  const [mode, setMode] = useState('view');

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formFields, setFormFields] = useState([]);

  // Encabezados de la tabla de lotes
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'manufacturer_lot', label: 'Lote Fabricante' },
    { key: 'expiration_date', label: 'Fecha de Vencimiento' },
    { key: 'stock', label: 'Stock' },
    { key: 'unit_price', label: 'Precio Unitario' }, 
    { key: 'product_name', label: 'Producto' },
  ];

  // Construye campos para el formulario de lote
  const buildFormFields = (lot) => {
    return [
      { name: 'manufacturer_lot', label: 'Lote Fabricante', type: 'text', value: lot.manufacturer_lot || '' },
      { name: 'expiration_date', label: 'Fecha de Vencimiento', type: 'date', value: lot.expiration_date || '' },
      { name: 'stock', label: 'Stock', type: 'number', value: lot.stock || 0 },
      { name: 'unit_price', label: 'Precio Unitario', type: 'number', value: lot.unit_price || 0 }, // ✅ Campo agregado
      {
        name: 'product_id',
        label: 'Producto',
        type: 'select',
        value: lot.product_id || '',
        options: products.map(p => ({ value: p.id, label: p.name }))
      },
    ];
  };

  // Vista
  const handleView = (lot) => {
    setSelectedLot(lot);
    setFormFields(buildFormFields(lot));
    setMode('view');
    setShowForm(true);
  };

  // Edición 
  const handleEdit = (lot) => {
    setSelectedLot(lot);
    setFormFields(buildFormFields(lot));
    setMode('edit');
    setShowForm(true);
  };

  // Agregar nuevo
  const handleAdd = () => {
    const emptyLot = { manufacturer_lot: '', expiration_date: '', stock: 0, unit_price: 0, product_id: '' };
    setSelectedLot(emptyLot);
    setFormFields(buildFormFields(emptyLot));
    setMode('add');
    setShowForm(true);
  };

  // Eliminar
  const handleDelete = (lot) => {
    setSelectedLot(lot);
    setShowConfirm(true);
  };

  // Cambios en campos
  const handleFieldChange = (name, value) => {
    setFormFields((prevFields) =>
      prevFields.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  // Guardar lote nuevo o actualizado
  const handleSave = () => {
    const lotData = formFields.reduce((acc, field) => {
      // Convierte valores numéricos apropiadamente
      acc[field.name] = field.type === 'number' ? parseFloat(field.value) : field.value;
      return acc;
    }, {});

    // Asegura que el product_id sea entero
    lotData.product_id = parseInt(lotData.product_id, 10);

    // Busca el nombre del producto para mostrarlo en la tabla
    const product = products.find(p => p.id === lotData.product_id);
    lotData.product_name = product?.name || '';

    if (mode === 'edit') {
      LotService.update(selectedLot.id, lotData);
    } else if (mode === 'add') {
      LotService.create(lotData);
    }

    setLots([...LotService.getAll()]);
    setShowForm(false);
  };
  
  // Confirmar eliminación
  const confirmDelete = () => {
    LotService.delete(selectedLot.id);
    setLots([...LotService.getAll()]);
    setShowConfirm(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Lotes" />
        <AddButton label="Agregar Lote" onClick={handleAdd} />
      </div>

      <ListTable
        headers={tableHeaders}
        data={lots}
        accordionHeaderKey={(item) => `${item.id} - ${item.manufacturer_lot}`}
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
        message={`¿Está seguro que desea eliminar el lote ${selectedLot?.manufacturer_lot}?`}
      />
    </div>
  );
}
