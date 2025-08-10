jest.mock('axios');

import React from 'react';
import CategoryService from '../CategoryService';
import api from '../api'; // La instancia axios

jest.mock('../api'); // Mockeamos toda la instancia de axios

describe('CategoryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll hace GET a /categories y devuelve data', async () => {
    const mockData = [{ id: 1, name: 'Cat1', description: 'Desc1' }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await CategoryService.getAll();

    expect(api.get).toHaveBeenCalledWith('/categories');
    expect(result).toEqual(mockData);
  });

  test('create hace POST a /categories con data', async () => {
    const category = { name: 'NewCat', description: 'NewDesc' };
    const responseData = { id: 2, ...category };
    api.post.mockResolvedValue({ data: responseData });

    const result = await CategoryService.create(category);

    expect(api.post).toHaveBeenCalledWith('/categories', category);
    expect(result).toEqual(responseData);
  });

  test('update hace PUT a /categories/:id con data', async () => {
    const category = { name: 'UpdatedCat', description: 'UpdatedDesc' };
    const id = 1;
    api.put.mockResolvedValue({ data: category });

    const result = await CategoryService.update(id, category);

    expect(api.put).toHaveBeenCalledWith(`/categories/${id}`, category);
    expect(result).toEqual(category);
  });

  test('delete hace DELETE a /categories/:id', async () => {
    const id = 1;
    api.delete.mockResolvedValue({ data: {} });

    const result = await CategoryService.delete(id);

    expect(api.delete).toHaveBeenCalledWith(`/categories/${id}`);
    expect(result).toEqual({});
  });
});
