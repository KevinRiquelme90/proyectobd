const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const InventoryMovement = require("../models/InventoryMovements");
const AuditLog = require("../models/AuditLog");

/*
  Servicio de compras
  - Valida la estructura de los items recibidos y normaliza cantidades/precios
  - Crea la entidad `Purchase` y actualiza el stock de productos con $inc
  - Registra movimientos de inventario para auditoría
  - Todo se ejecuta dentro de una transacción mongoose para asegurar
    que la compra y las actualizaciones de stock sean atómicas.
*/

exports.createPurchase = async ({ usuario, proveedor, items, total, nota }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("La compra debe incluir al menos un producto");
  }

  const purchaseItems = items.map((item) => {
    const cantidad = Number(item.cantidad);
    const precioCompra = Number(item.precio_compra ?? item.precio_unitario ?? 0);

    if (!item.producto || cantidad <= 0 || precioCompra < 0) {
      throw new Error("Item de compra inválido");
    }

    return {
      producto: item.producto,
      cantidad,
      precio_unitario: precioCompra,
      subtotal: Number((cantidad * precioCompra).toFixed(2))
    };
  });

  const purchaseTotal = Number(
    (total ?? purchaseItems.reduce((sum, item) => sum + item.subtotal, 0)).toFixed(2)
  );

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchase = await Purchase.create(
      [
        {
          usuario,
          proveedor,
          items: purchaseItems,
          total: purchaseTotal,
          nota
        }
      ],
      { session }
    );

    const savedPurchase = purchase[0];

    for (const item of purchaseItems) {
      const updatedProduct = await Product.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: item.cantidad } },
        { session, returnDocument: 'after' }
      );

      if (!updatedProduct) {
        throw new Error(`No se encontró el producto ${item.producto} para actualizar stock`);
      }

      await InventoryMovement.create(
        [
          {
            producto: item.producto,
            tipo: "COMPRA",
            cantidad: item.cantidad,
            motivo: nota || "Compra de inventario",
            usuario
          }
        ],
        { session }
      );
    }

    await session.commitTransaction();
    // Registrar entrada de auditoría dentro de la transacción
    await AuditLog.create(
      [
        {
          usuario,
          accion: "CREAR_COMPRA",
          entidad: "Purchase",
          detalle: `Compra ${savedPurchase._id} creada con ${purchaseItems.length} items`,
          meta: { purchaseId: savedPurchase._id }
        }
      ],
      { session }
    );

    return savedPurchase;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createPurchase:", error.message || error);
    throw new Error(`Error al crear compra: ${error.message}`);
  } finally {
    session.endSession();
  }
};

exports.listPurchases = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.search) {
    query.nota = new RegExp(options.search, "i");
  }

  const purchases = await Purchase.find(query)
    .populate("proveedor")
    .populate("usuario")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Purchase.countDocuments(query);

  return { purchases, total, page, pages: Math.ceil(total / limit) };
};
