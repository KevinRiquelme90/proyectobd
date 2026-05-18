const Product = require("../models/Product");

const buildQuery = ({ search, category, provider, lowStock }) => {
  const query = { activo: true };

  if (search) {
    query.$or = [
      { nombre: new RegExp(search, "i") },
      { descripcion: new RegExp(search, "i") },
      { codigo_barra: new RegExp(search, "i") }
    ];
  }

  if (category) {
    query.categoria = category;
  }

  if (provider) {
    query.proveedor = provider;
  }

  if (lowStock) {
    query.$expr = { $lte: ["$stock", "$stock_minimo"] };
  }

  return query;
};

exports.listProducts = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const sortField = options.sortBy || "createdAt";
  const sortOrder = options.order === "asc" ? 1 : -1;
  const query = buildQuery(options);

  const products = await Product.find(query)
    .populate("categoria")
    .populate("proveedor")
    .sort({ [sortField]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return { products, total, page, pages: Math.ceil(total / limit) };
};

exports.getProductById = async (id) => {
  return Product.findById(id).populate("categoria").populate("proveedor");
};

exports.createProduct = async (data) => {
  return Product.create(data);
};

exports.updateProduct = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteProduct = async (id) => {
  return Product.findByIdAndUpdate(id, { activo: false }, { new: true });
};

exports.getLowStockCount = async () => {
  return Product.countDocuments({ activo: true, $expr: { $lte: ["$stock", "$stock_minimo"] } });
};
