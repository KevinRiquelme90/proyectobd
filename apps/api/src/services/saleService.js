const Sale = require("../models/Sale");
const SaleDetail = require("../models/SaleDetail");
const Product = require("../models/Product");
const InventoryMovement = require("../models/InventoryMovements");

exports.createSale = async ({ usuario, cliente, metodo_pago, items, total }) => {
  const sale = await Sale.create({ usuario, cliente, metodo_pago, total });

  const saleDetails = items.map((item) => ({
    venta: sale._id,
    producto: item.producto,
    cantidad: item.cantidad,
    precio: item.precio,
    subtotal: item.subtotal
  }));

  await SaleDetail.insertMany(saleDetails);

  await Promise.all(
    items.map(async (item) => {
      await Product.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad }
      });

      await InventoryMovement.create({
        producto: item.producto,
        tipo: "VENTA",
        cantidad: item.cantidad,
        motivo: "Venta POS",
        usuario
      });
    })
  );

  return sale;
};

exports.listSales = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.search) {
    query.$or = [
      { metodo_pago: new RegExp(options.search, "i") }
    ];
  }

  if (options.usuario) {
    query.usuario = options.usuario;
  }

  const sales = await Sale.find(query)
    .populate("cliente")
    .populate("usuario")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Sale.countDocuments(query);

  return { sales, total, page, pages: Math.ceil(total / limit) };
};

exports.getSaleById = async (id) => {
  return Sale.findById(id).populate("cliente").populate("usuario");
};
