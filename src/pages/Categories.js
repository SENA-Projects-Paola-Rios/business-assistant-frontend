import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import CategoryService from '../services/Category';

// Componente principal que gestiona las categorías (listar, crear, editar, eliminar)
export default function Categories() {

  const [categories, setCategories] = useState(CategoryService.getAll());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  // Encabezados de la tabla de categorías
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
  ];

  // Construye los campos del formulario según la categoría actual
  const buildFormFields = (category) => {
    return [
      { name: 'name', label: 'Nombre', type: 'text', value: category.name || '' },
      { name: 'description', label: 'Descripción', type: 'text', value: category.description || '' },
    ];
  };

  // Ver detalles de una categoría (modo solo lectura)
  const handleView = (category) => {
    setSelectedCategory(category);
    setFormFields(buildFormFields(category));
    setMode('view');
    setShowForm(true);
  };

  // Editar una categoría existente
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormFields(buildFormFields(category));
    setMode('edit');
    setShowForm(true);
  };

  // Agregar una nueva categoría
  const handleAdd = () => {
    const emptyCategory = { name: '', description: '' };
    setSelectedCategory(emptyCategory);
    setFormFields(buildFormFields(emptyCategory));
    setMode('add');
    setShowForm(true);
  };

  // Eliminar una categoría (mostrar modal de confirmación)
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowConfirm(true);
  };

  // Actualiza el estado del formulario cuando se edita un campo
  const handleFieldChange = (name, value) => {
    setFormFields((prevFields) =>
      prevFields.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  // Guardar una categoría (crear o actualizar)
  const handleSave = () => {
    const categoryData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    // Dependiendo del modo, crea o actualiza la categoría
    if (mode === 'edit') {
      CategoryService.update(selectedCategory.id, categoryData);
    } else if (mode === 'add') {
      CategoryService.create(categoryData);
    }

    setCategories([...CategoryService.getAll()]);
    setShowForm(false);
  };

  const confirmDelete = () => {
    CategoryService.delete(selectedCategory.id);
    setCategories([...CategoryService.getAll()]);
    setShowConfirm(false);
  };

  // Renderiza el componente completo
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Categorías" />
        <AddButton label="Agregar Categoría" onClick={handleAdd} />
      </div>

      {/* Tabla que muestra las categorías */}
      <ListTable
        headers={tableHeaders}
        data={categories}
        accordionHeaderKey="name"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal para ver, agregar o editar una categoría */}
      <ModalForm
        show={showForm}
        onClose={() => setShowForm(false)}
        mode={mode}
        fields={formFields}
        onChange={handleFieldChange}
        onSave={handleSave}
      />

      {/* Modal de confirmación de eliminación */}
      <ModalConfirmation
        show={showConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        message={`¿Está seguro que desea eliminar la categoría ${selectedCategory?.name}?`}
      />
    </div>
  );
}
