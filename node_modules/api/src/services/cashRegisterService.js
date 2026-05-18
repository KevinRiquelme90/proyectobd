const CashRegister = require("../models/CashRegister");

exports.openRegister = async ({ usuario, apertura }) => {
  const active = await CashRegister.findOne({ estado: "abierta" });
  if (active) {
    throw new Error("Ya hay una caja abierta");
  }

  return CashRegister.create({ usuario, apertura, ingresos: 0, egresos: 0, saldo_final: apertura });
};

exports.closeRegister = async (id, { ingresos, egresos, saldo_final }) => {
  return CashRegister.findByIdAndUpdate(
    id,
    { ingresos, egresos, saldo_final, estado: "cerrada" },
    { new: true, runValidators: true }
  );
};

exports.listRegisters = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.estado) {
    query.estado = options.estado;
  }

  const registers = await CashRegister.find(query)
    .populate("usuario")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await CashRegister.countDocuments(query);

  return { registers, total, page, pages: Math.ceil(total / limit) };
};
