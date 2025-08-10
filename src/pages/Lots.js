// src/pages/Lots.js
import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import LotService from '../services/LotService';
import ProductService from '../services/ProductService';

export default function Lots() {
  const [lots, setLots] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [mode, setMode] = useState('view');

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formFields, setFormFields] = useState([]);

  // Encabezados de la tabla de lotes
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'manufacturerLot', label: 'Lote Fabricante' },
    { key: 'expirationDate', label: 'Fecha de Vencimiento' },
    { key: 'stock', label: 'Stock' },
    { key: 'productName', label: 'Producto' },
  ];

  // Carga inicial de lotes y productos
  useEffect(() => {
    loadLots();
    loadProducts();
  }, []);

  const loadLots = async () => {
    try {
      const res = await LotService.getAll();
      // Mapeamos para adaptarlo a las keys usadas en la tabla (por ejemplo, productName)
      const lotsWithProductName = res.map(lot => ({
        id: lot.id,
        manufacturerLot: lot.manufacturerLot,
        expirationDate: lot.expirationDate,
        stock: lot.stock,
        productName: lot.productName || '',
        productId: lot.productId || null,
      }));
      setLots(lotsWithProductName);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await ProductService.getAll();
      setProducts(res);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  // Construye campos para el formulario de lote
  const buildFormFields = (lot) => {
    return [
      { name: 'manufacturerLot', label: 'Lote Fabricante', type: 'text', value: lot.manufacturerLot || '' },
      { name: 'expirationDate', label: 'Fecha de Vencimiento', type: 'date', value: lot.expirationDate || '' },
      { name: 'stock', label: 'Stock', type: 'number', value: lot.stock || 0 },
      {
        name: 'productId',
        label: 'Producto',
        type: 'select',
        value: lot.productId || '',
        options: products.map(p => ({ value: p.id, label: p.name })),
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
    const emptyLot = { manufacturerLot: '', expirationDate: '', stock: 0, unitPrice: 0, productId: '' };
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
  const handleSave = async () => {
    const lotData = formFields.reduce((acc, field) => {
      acc[field.name] = field.type === 'number' ? parseFloat(field.value) : field.value;
      return acc;
    }, {});

    // Adaptar la estructura para backend (el producto debe ir anidado)
    lotData.product = { id: parseInt(lotData.productId, 10) };
    delete lotData.productId;

    try {
      let response = {}
      if (mode === 'edit') {
        response = await LotService.update(selectedLot.id, lotData);
        if ('message' in response) {
          alert(response.message);
        }
      } else if (mode === 'add') {
        response = await LotService.create(lotData);
        if ('message' in response) {
          alert(response.message);
        }
      }
      await loadLots();
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar lote:', error);
    }
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      let response = await LotService.delete(selectedLot.id);
      if ('message' in response) {
          alert(response.message);
        }
      await loadLots();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al eliminar lote:', error);
    }
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
        accordionHeaderKey={(item) => `${item.id} - ${item.manufacturerLot}`}
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
        message={`¿Está seguro que desea eliminar el lote ${selectedLot?.manufacturerLot}?`}
      />
    </div>
  );
}
