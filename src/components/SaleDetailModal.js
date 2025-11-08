// Componente para mostrar un modal con el detalle de una venta

import React from 'react';

export default function SaleDetailModal({ show, onClose, details }) {
  // Si el modal no debe mostrarse, no renderizamos nada
  if (!show) return null;

  // Nos aseguramos de que cada detalle tenga su subtotal calculado correctamente
  const detailsWithSubtotal = details.map((detail) => {
    // Verificamos si ya existe el unit_price (proporcionado desde el mock)
    const unitPrice = detail.unit_price || 0;
    const subtotal = detail.quantity * unitPrice;
    return {
      ...detail,
      subtotal,
    };
  });

  return (
    <div className="custom-modal-backdrop">
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Encabezado del modal */}
            <div className="modal-header">
              <h5 className="modal-title">Detalle de la Venta</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* Cuerpo del modal con la tabla de detalles */}
            <div className="modal-body">
              {detailsWithSubtotal.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Lote</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsWithSubtotal.map((detail, idx) => (
                      <tr key={idx}>
                        <td>{detail.lotId}</td>
                        <td>{detail.productName}</td>
                        <td>{detail.quantity}</td>
                        <td>${detail.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay detalles para esta venta.</p>
              )}
            </div>

            {/* Pie del modal con botón para cerrar */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
