const InventoryMovement = require("../models/InventoryMovements");

exports.listMovements = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.producto) {
    query.producto = options.producto;
  }

  if (options.tipo) {
    query.tipo = options.tipo;
  }

  const movements = await InventoryMovement.find(query)
    .populate("producto")
    .populate("usuario")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await InventoryMovement.countDocuments(query);

  return { movements, total, page, pages: Math.ceil(total / limit) };
};
