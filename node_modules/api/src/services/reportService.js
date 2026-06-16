const Sale = require("../models/Sale");
const Product = require("../models/Product");
const SaleDetail = require("../models/SaleDetail");
const Purchase = require("../models/Purchase");
const InventoryMovement = require("../models/InventoryMovements");
const Client = require("../models/Client");

/*
  Servicio de reportes/dashboards
  - Construye varias agregaciones para:
    - Ventas por día / mes
    - Total de ventas/compras
    - Cálculo de pérdidas (mermas) usando $lookup y $group
    - Top productos por unidades vendidas
    - Ganancia neta estimada (ventas - compras - mermas)
  - Usar agregaciones en la base de datos mejora rendimiento al procesar
    grandes volúmenes de datos en lugar de hacerlo en la aplicación.
*/

exports.getDashboardStats = async () => {
  const today = new Date();
  const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const ventasDia = await Sale.aggregate([
    { $match: { createdAt: { $gte: startDay }, estado: "pagada" } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const ventasMes = await Sale.aggregate([
    { $match: { createdAt: { $gte: startMonth }, estado: "pagada" } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const totalVentasAgg = await Sale.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const totalComprasAgg = await Purchase.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const mermasAgg = await InventoryMovement.aggregate([
    { $match: { tipo: "MERMA" } },
    {
      $lookup: {
        from: "products",
        localField: "producto",
        foreignField: "_id",
        as: "producto"
      }
    },
    { $unwind: "$producto" },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ["$cantidad", "$producto.precio_compra"] } },
        units: { $sum: "$cantidad" }
      }
    }
  ]);

  const totalVentas = totalVentasAgg[0]?.total || 0;
  const totalCompras = totalComprasAgg[0]?.total || 0;
  const totalMermas = mermasAgg[0]?.total || 0;
  const totalMermasUnits = mermasAgg[0]?.units || 0;

  const productosBajos = await Product.find({ activo: true, $expr: { $lte: ["$stock", "$stock_minimo"] } })
    .populate("categoria")
    .select("nombre stock stock_minimo categoria")
    .lean();

  const gananciaNeta = totalVentas - totalCompras - totalMermas;

  const ganancias = await SaleDetail.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "producto",
        foreignField: "_id",
        as: "producto"
      }
    },
    { $unwind: "$producto" },
    {
      $group: {
        _id: null,
        totalGanancia: {
          $sum: {
            $subtract: [
              "$subtotal",
              { $multiply: ["$cantidad", "$producto.precio_compra"] }
            ]
          }
        }
      }
    }
  ]);

  const topProducts = await SaleDetail.aggregate([
    {
      $group: {
        _id: "$producto",
        ventas: { $sum: "$cantidad" }
      }
    },
    { $sort: { ventas: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "producto"
      }
    },
    { $unwind: "$producto" },
    {
      $project: {
        nombre: "$producto.nombre",
        ventas: 1,
        stock: "$producto.stock"
      }
    }
  ]);

  const totalClientes = await Client.countDocuments();

  return {
    ventasDia: ventasDia[0]?.total || 0,
    ventasMes: ventasMes[0]?.total || 0,
    totalVentas,
    totalCompras,
    totalMermas,
    totalMermasUnits,
    productosBajos: productosBajos.length,
    lowStockProducts: productosBajos.map((product) => ({
      _id: product._id,
      nombre: product.nombre,
      stock: product.stock,
      stock_minimo: product.stock_minimo,
      categoria: product.categoria?.nombre || "Sin categoría"
    })),
    ganancias: gananciaNeta,
    rawGanancia: ganancias[0]?.totalGanancia || 0,
    topProducts,
    totalClientes
  };
};