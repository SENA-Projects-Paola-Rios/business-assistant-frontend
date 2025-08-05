import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import UserService from '../services/User';

// Este componente representa la página de Usuarios, con listado, creación, edición, vista y eliminación de usuarios
export default function Users() {
  const [users, setUsers] = useState(UserService.getAll());
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  // Definimos los encabezados para la tabla en formato dinámico (key y label)
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
  ];

  // Construye los campos para el formulario según el usuario y si debe incluir contraseña
  const buildFormFields = (user, includePassword = false) => {
    const fields = [
      { name: 'nombre', label: 'Nombre', type: 'text', value: user.nombre || '' },
      { name: 'email', label: 'Email', type: 'email', value: user.email || '' },
      { name: 'rol', label: 'Rol', type: 'text', value: user.rol || '' },
    ];
    if (includePassword) {
      fields.splice(2, 0, { name: 'password', label: 'Contraseña', type: 'password', value: '' });
    }
    return fields;
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setFormFields(buildFormFields(user));
    setMode('view');
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormFields(buildFormFields(user, true));
    setMode('edit');
    setShowForm(true);
  };

  const handleAdd = () => {
    const emptyUser = { nombre: '', email: '', rol: '', password: '' };
    setSelectedUser(emptyUser);
    setFormFields(buildFormFields(emptyUser, true));
    setMode('add');
    setShowForm(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  // Actualiza los valores de los campos del formulario conforme el usuario edita
  const handleFieldChange = (name, value) => {
    setFormFields((prevFields) =>
      prevFields.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleSave = () => {
    // Convertimos el arreglo de campos en un objeto usuario
    const userData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    if (mode === 'edit') {
      UserService.update(selectedUser.id, userData);
    } else if (mode === 'add') {
      UserService.create(userData);
    }
    setUsers([...UserService.getAll()]);
    setShowForm(false);
  };

  const confirmDelete = () => {
    UserService.delete(selectedUser.id);
    setUsers([...UserService.getAll()]);
    setShowConfirm(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SectionTitle title="Usuarios" />
        <AddButton label="Agregar Usuario" onClick={handleAdd} />
      </div>

      <ListTable 
        headers={tableHeaders}   // pasamos los headers como arreglo de objetos dinámico
        data={users}
        accordionHeaderKey="email"
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
        message={`¿Está seguro que desea eliminar al usuario ${selectedUser?.nombre}?`}
      />
    </div>
  );
}
