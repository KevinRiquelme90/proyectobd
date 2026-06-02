const Sale = require("../models/Sale");
const SaleDetail = require("../models/SaleDetail");
const Product = require("../models/Product");
const InventoryMovement = require("../models/InventoryMovements");
const mongoose = require("mongoose");

exports.createSale = async ({ usuario, cliente, metodo_pago, items, total }) => {
  // Iniciar sesión para transacción
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validar que todos los productos existan y tengan stock suficiente
    for (const item of items) {
      const product = await Product.findById(item.producto).session(session);
      
      if (!product) {
        throw new Error(`Producto ${item.producto} no encontrado`);
      }
      
      if (product.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}, Solicitado: ${item.cantidad}`);
      }
    }

    // Crear venta
    const sale = await Sale.create([{ usuario, cliente, metodo_pago, total }], { session });
    const saleId = sale[0]._id;

    // Crear detalles de venta
    const saleDetails = items.map((item) => ({
      venta: saleId,
      producto: item.producto,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.subtotal
    }));

    await SaleDetail.insertMany(saleDetails, { session });

    // Actualizar stock de productos y crear movimientos
    for (const item of items) {
      // Actualizar stock del producto
      const updatedProduct = await Product.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: -item.cantidad } },
        { session, new: true }
      );

      if (!updatedProduct) {
        throw new Error(`No se pudo actualizar stock del producto ${item.producto}`);
      }

      // Registrar movimiento de inventario
      await InventoryMovement.create(
        [{
          producto: item.producto,
          tipo: "VENTA",
          cantidad: item.cantidad,
          motivo: "Venta POS",
          usuario
        }],
        { session }
      );
    }

    // Confirmar transacción
    await session.commitTransaction();
    
    return await Sale.findById(saleId).populate("cliente").populate("usuario");
  } catch (error) {
    // Revertir cambios en caso de error
    await session.abortTransaction();
    console.error("Error en createSale:", error.message);
    throw new Error(`Error al crear venta: ${error.message}`);
  } finally {
    session.endSession();
  }
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
