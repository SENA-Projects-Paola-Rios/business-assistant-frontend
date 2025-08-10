// src/pages/Categories.js
import { React, useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import CategoryService from '../services/CategoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  // Encabezados de la tabla
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
  ];

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await CategoryService.getAll();
      setCategories(res);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const buildFormFields = (category) => [
    { name: 'name', label: 'Nombre', type: 'text', value: category.name || '' },
    { name: 'description', label: 'Descripción', type: 'text', value: category.description || '' },
  ];

  const handleView = (category) => {
    setSelectedCategory(category);
    setFormFields(buildFormFields(category));
    setMode('view');
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormFields(buildFormFields(category));
    setMode('edit');
    setShowForm(true);
  };

  const handleAdd = () => {
    const emptyCategory = { name: '', description: '' };
    setSelectedCategory(emptyCategory);
    setFormFields(buildFormFields(emptyCategory));
    setMode('add');
    setShowForm(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowConfirm(true);
  };

  const handleFieldChange = (name, value) => {
    setFormFields((prevFields) =>
      prevFields.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleSave = async () => {
    const categoryData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    try {
      if (mode === 'edit') {
        await CategoryService.update(selectedCategory.id, categoryData);
      } else if (mode === 'add') {
        await CategoryService.create(categoryData);
      }
      await loadCategories();
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await CategoryService.delete(selectedCategory.id);
      await loadCategories();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Categorías" />
        <AddButton label="Agregar Categoría" onClick={handleAdd} />
      </div>

      <ListTable
        headers={tableHeaders}
        data={categories}
        accordionHeaderKey={(item) => `${item.name} - ${item.description}`}
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
        message={`¿Está seguro que desea eliminar la categoría ${selectedCategory?.name}?`}
      />
    </div>
  );
}
