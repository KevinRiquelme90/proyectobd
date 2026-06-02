const InventoryMovement = require("../models/InventoryMovements");
const Product = require("../models/Product");

exports.listInventory = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = { activo: true };

  if (options.search) {
    query.$or = [
      { nombre: new RegExp(options.search, "i") },
      { codigo_barra: new RegExp(options.search, "i") }
    ];
  }

  if (options.lowStock === "true") {
    query.$expr = { $lte: ["$stock", "$stock_minimo"] };
  }

  const products = await Product.find(query)
    .populate("categoria")
    .populate("proveedor")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);

  // Enriquecer con información de movimientos si es necesario
  const inventory = products.map((product) => ({
    _id: product._id,
    nombre: product.nombre,
    codigo_barra: product.codigo_barra,
    stock: product.stock,
    stock_minimo: product.stock_minimo,
    unidad_medida: product.unidad_medida,
    precio_compra: product.precio_compra,
    precio_venta: product.precio_venta,
    valor_promedio: product.precio_compra,
    categoria: product.categoria,
    proveedor: product.proveedor,
    producto: product // Para compatibilidad con frontend
  }));

  return { 
    inventory,
    products: inventory, // Alias para compatibilidad
    total, 
    page, 
    pages: Math.ceil(total / limit) 
  };
};

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
