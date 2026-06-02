const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const InventoryMovement = require("../models/InventoryMovements");

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

  const purchase = await Purchase.create({
    usuario,
    proveedor,
    items: purchaseItems,
    total: purchaseTotal,
    nota
  });

  await Promise.all(
    purchaseItems.map(async (item) => {
      await Product.findByIdAndUpdate(item.producto, {
        $inc: { stock: item.cantidad }
      });

      await InventoryMovement.create({
        producto: item.producto,
        tipo: "COMPRA",
        cantidad: item.cantidad,
        motivo: nota || "Compra de inventario",
        usuario
      });
    })
  );

  return purchase;
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
