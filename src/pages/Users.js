import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddButton from '../components/AddButton';
import ListTable from '../components/ListTable';
import ModalForm from '../components/ModalForm';
import ModalConfirmation from '../components/ModalConfirmation';
import UserService from '../services/UserService';

// Este componente representa la página de Usuarios, con listado, creación, edición, vista y eliminación de usuarios
export default function Users() {
  // Lista de usuarios obtenida desde la API
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('view');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formFields, setFormFields] = useState([]);

  // Definimos los encabezados para la tabla en formato dinámico (key y label)
  const tableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rol' },
  ];

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);


  // Función para obtener usuarios desde la API
  const loadUsers = async () => {
    try {
      const res = await UserService.getAll();
      setUsers(res); // Actualizamos estado con datos de la API
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Construye los campos para el formulario según el usuario y si debe incluir contraseña
  const buildFormFields = (user, includePassword = false) => {
    const fields = [
      { name: 'name', label: 'Nombre', type: 'text', value: user.name || '' },
      { name: 'email', label: 'Email', type: 'email', value: user.email || '' },
      { name: 'role', label: 'Rol', type: 'text', value: user.role || '' },
    ];
    if (includePassword) {
      fields.splice(2, 0, { name: 'password', label: 'Contraseña', type: 'password', value: '' });
    }
    return fields;
  };

  const handleView = (user) => {
    console.log("handleview ", user)
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

  // Guardar cambios (crear o actualizar usuario)
  const handleSave = async () => {
    // Convertimos el arreglo de campos en un objeto usuario
    const userData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    try {
      if (mode === 'edit') {
        await UserService.update(selectedUser.id, userData);
      } else if (mode === 'add') {
        await UserService.create(userData);
      }
      await loadUsers(); // Recargamos lista desde la API
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await UserService.delete(selectedUser.id);
      await loadUsers(); // Recargar lista
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
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
        accordionHeaderKey={(item) => `${item.name} - ${item.email}`}
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
        message={`¿Está seguro que desea eliminar al usuario ${selectedUser?.name}?`}
      />
    </div>
  );
}
