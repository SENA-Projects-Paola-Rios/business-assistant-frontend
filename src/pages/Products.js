import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import ProductService from '../services/Product';
import CategoryService from '../services/Category';
import LotService from '../services/Lot';

// Componente principal para la gestión de productos
export default function Products() {
  const [products, setProducts] = useState(ProductService.getAll());

  // Carga inicial de categorías y lotes (usados para los selects)
  const [categories] = useState(CategoryService.getAll());
  const [lots] = useState(LotService.getAll());

  // Estados para control de formulario y acciones
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  // Columnas de la tabla
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
    { key: 'category_name', label: 'Categoría' },
    { key: 'manufacturer_lot', label: 'Lote Fabricante' },
    { key: 'stock', label: 'Stock' },
  ];

  // Generar campos del formulario con opciones para selects
  const buildFormFields = (product) => {
    return [
      { name: 'name', label: 'Nombre', type: 'text', value: product.name || '' },
      { name: 'description', label: 'Descripción', type: 'text', value: product.description || '' },
      { name: 'price', label: 'Precio', type: 'number', value: product.price || '' },
      {
        name: 'category_id',
        label: 'Categoría',
        type: 'select',
        value: product.category_id || '',
        options: categories.map(c => ({ value: c.id, label: c.name }))
      },
      {
        name: 'lot_id',
        label: 'Lote Fabricante',
        type: 'select',
        value: product.lot_id || '',
        options: lots.map(l => ({ value: l.id, label: l.manufacturer_lot }))
      }
    ];
  };

  // Abrir formulario en modo vista
  const handleView = (product) => {
    setSelectedProduct(product);
    setFormFields(buildFormFields(product));
    setMode('view');
    setShowForm(true);
  };

  // Abrir formulario en modo edición
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormFields(buildFormFields(product));
    setMode('edit');
    setShowForm(true);
  };

  // Preparar formulario para nuevo producto
  const handleAdd = () => {
    const emptyProduct = { name: '', description: '', price: '', category_id: '', lot_id: '' };
    setSelectedProduct(emptyProduct);
    setFormFields(buildFormFields(emptyProduct));
    setMode('add');
    setShowForm(true);
  };

  // Confirmación para eliminar
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  // Actualización de valores en los inputs
  const handleFieldChange = (name, value) => {
    setFormFields(prev =>
      prev.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  // Guardar producto: agregar o editar
  const handleSave = () => {
    const productData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    // Agregar campos calculados desde lot y category
    const category = categories.find(c => c.id === parseInt(productData.category_id));
    const lot = lots.find(l => l.id === parseInt(productData.lot_id));
    productData.category_name = category?.name || '';
    productData.manufacturer_lot = lot?.manufacturer_lot || '';
    productData.stock = lot?.stock || 0;

    if (mode === 'edit') {
      ProductService.update(selectedProduct.id, productData);
    } else {
      ProductService.create(productData);
    }

    setProducts([...ProductService.getAll()]);
    setShowForm(false);
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    ProductService.delete(selectedProduct.id);
    setProducts([...ProductService.getAll()]);
    setShowConfirm(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Productos" />
        <AddButton label="Agregar Producto" onClick={handleAdd} />
      </div>

      <ListTable
        headers={tableHeaders}
        data={products}
        accordionHeaderKey="name"
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
        message={`¿Está seguro que desea eliminar el producto ${selectedProduct?.name}?`}
      />
    </div>
  );
}
