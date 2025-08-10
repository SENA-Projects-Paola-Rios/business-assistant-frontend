jest.mock('axios');

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Categories from '../../pages/Categories';
import CategoryService from '../../services/CategoryService';

jest.mock('../../services/CategoryService');

const mockCategories = [
  { id: 1, name: 'Cat1', description: 'Desc1' },
  { id: 2, name: 'Cat2', description: 'Desc2' },
];

describe('Categories component', () => {
  beforeEach(() => {
    CategoryService.getAll.mockResolvedValue(mockCategories);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('muestra lista de categorías cargadas', async () => {
    render(<Categories />);
    await waitFor(() => {
      expect(screen.getByText('Cat1')).toBeInTheDocument();
      expect(screen.getByText('Desc1')).toBeInTheDocument();
      expect(screen.getByText('Cat2')).toBeInTheDocument();
      expect(screen.getByText('Desc2')).toBeInTheDocument();
    });
  });

  test('al hacer click en "Agregar Categoría" abre modal con campos vacíos', async () => {
    render(<Categories />);
    await waitFor(() => expect(CategoryService.getAll).toHaveBeenCalled());

    userEvent.click(screen.getByText('Agregar Categoría'));

    // Usa findByLabelText para esperar a que los inputs estén en el DOM
    const nameInput = await screen.findByLabelText('Nombre');
    const descInput = await screen.findByLabelText('Descripción');

    expect(nameInput).toHaveValue('');
    expect(descInput).toHaveValue('');
  });

  test('guardar una nueva categoría llama a create y recarga lista', async () => {
    CategoryService.create.mockResolvedValue({ id: 3, name: 'NewCat', description: 'NewDesc' });
    render(<Categories />);
    await waitFor(() => expect(CategoryService.getAll).toHaveBeenCalled());

    userEvent.click(screen.getByText('Agregar Categoría'));

    const nameInput = await screen.findByLabelText('Nombre');
    const descInput = await screen.findByLabelText('Descripción');

    userEvent.clear(nameInput);
    userEvent.type(nameInput, 'NewCat');
    userEvent.clear(descInput);
    userEvent.type(descInput, 'NewDesc');

    userEvent.click(screen.getByText('Guardar'));

    
    });

});
