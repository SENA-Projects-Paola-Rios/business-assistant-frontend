// Lista simulada de detalles de venta con precios unitarios
const mockSaleDetails = [
  {
    sale_id: 1,
    lot_id: 1,
    quantity: 3,
    lot_code: 'LOT123ABC',
    product_name: 'Jugo de Naranja',
    unit_price: 2500
  },
  {
    sale_id: 1,
    lot_id: 2,
    quantity: 2,
    lot_code: 'LOT456DEF',
    product_name: 'Leche Deslactosada',
    unit_price: 3000
  },
  {
    sale_id: 2,
    lot_id: 2,
    quantity: 1,
    lot_code: 'LOT456DEF',
    product_name: 'Leche Deslactosada',
    unit_price: 3000
  }
];

// Servicio simulado para operaciones sobre detalles de venta
const SaleDetailService = {
  getAll: () =>
    mockSaleDetails.map((d) => ({
      ...d,
      subtotal: d.quantity * d.unit_price
    })),

  getBySaleId: (sale_id) =>
    mockSaleDetails
      .filter((d) => d.sale_id === sale_id)
      .map((d) => ({
        ...d,
        subtotal: d.quantity * d.unit_price
      })),

  create: (detail) => {
    detail.unit_price = parseFloat(detail.unit_price) || 0;
    detail.subtotal = detail.quantity * detail.unit_price;
    mockSaleDetails.push(detail);
  },

  update: (sale_id, lot_id, updatedDetail) => {
    const index = mockSaleDetails.findIndex(
      (d) => d.sale_id === sale_id && d.lot_id === lot_id
    );
    if (index > -1) {
      const merged = {
        ...mockSaleDetails[index],
        ...updatedDetail
      };
      merged.unit_price = parseFloat(merged.unit_price) || 0;
      merged.subtotal = merged.quantity * merged.unit_price;
      mockSaleDetails[index] = merged;
    }
  },

  delete: (sale_id, lot_id) => {
    const index = mockSaleDetails.findIndex(
      (d) => d.sale_id === sale_id && d.lot_id === lot_id
    );
    if (index > -1) mockSaleDetails.splice(index, 1);
  }
};

export default SaleDetailService;