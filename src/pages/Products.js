// src/pages/Products.js
import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import ProductService from '../services/ProductService';
import CategoryService from '../services/CategoryService';
import LotService from '../services/LotService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lots, setLots] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
    { key: 'categoryNames', label: 'Categoría' },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadLots();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await ProductService.getAll();
      
      const productsWithCategories = res.map(producto => {
          const categoryNames = producto.categories
              .map(category => category.name)
              .join(', '); // si no hay categorías, queda ""
             

          return {
              ...producto, // mantiene todos los datos originales
              categoryNames,
          };
      });

      setProducts(productsWithCategories);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await CategoryService.getAll();
      setCategories(res);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
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

  const buildFormFields = (product) => {
    return [
      { name: 'name', label: 'Nombre', type: 'text', value: product.name || '' },
      { name: 'description', label: 'Descripción', type: 'text', value: product.description || '' },
      { name: 'price', label: 'Precio', type: 'number', value: product.price || '' },
      {
        name: 'category_id',
        label: 'Categoría',
        type: 'select',
        value: product.categories.length > 0 ? product.categories[0].id : '' || '',        
        options: categories.map(c => ({ value: c.id, label: c.name }))
      },
    ];
  };

  const buildProductCategoryAdd = (productId, categoryId) => {
    return {
      "id": {
        "productId": productId,
        "categoryId": categoryId
      },
      "product": {
        "id": productId
      },
      "category": {
        "id": categoryId
      }
    }
  };


  const handleView = (product) => {
    setSelectedProduct(product);
    setFormFields(buildFormFields(product));
    setMode('view');
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormFields(buildFormFields(product));
    setMode('edit');
    setShowForm(true);
  };

  const handleAdd = () => {
    const emptyProduct = { name: '', description: '', price: '', category_id: '', lot_id: '' };
    setSelectedProduct(emptyProduct);
    setFormFields(buildFormFields(emptyProduct));
    setMode('add');
    setShowForm(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const handleFieldChange = (name, value) => {
    setFormFields(prev =>
      prev.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleSave = async () => {
    const productData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    // Datos extra para mostrar en tabla
    const category = categories.find(c => c.id === parseInt(productData.category_id));
    const lot = lots.find(l => l.id === parseInt(productData.lot_id));
    productData.category_name = category?.name || '';
    productData.manufacturer_lot = lot?.manufacturer_lot || '';
    productData.stock = lot?.stock || 0;

    try {
      let response = {};
      if (mode === 'edit') {
        response = await ProductService.deleteCategory(selectedProduct.id)
        response =await ProductService.addCategory(buildProductCategoryAdd(selectedProduct.id, productData.category_id));
        response = await ProductService.update(selectedProduct.id, productData);

        if ('message' in response) {
          alert(response.message);
        }
        
      } else if (mode === 'add') {
        response = await ProductService.create(productData);
        if ('message' in response) {
          alert(response.message);
        }
        
        response =await ProductService.addCategory(buildProductCategoryAdd(response.id, productData.category_id));
        
      }
      await loadProducts();
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      let response = await ProductService.delete(selectedProduct.id);
      if ('message' in response) {
          alert(response.message);
        }
      await loadProducts();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
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
        accordionHeaderKey={(item) => `${item.name} - ${item.manufacturer_lot}`}
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
