const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const InventoryMovement = require("../models/InventoryMovements");

exports.createPurchase = async ({ usuario, proveedor, items, total, nota }) => {
  const purchase = await Purchase.create({ usuario, proveedor, items, total, nota });

  await Promise.all(
    items.map(async (item) => {
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
