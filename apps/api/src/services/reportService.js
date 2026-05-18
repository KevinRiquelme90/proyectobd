const Sale = require("../models/Sale");
const Product = require("../models/Product");
const SaleDetail = require("../models/SaleDetail");

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

  const productosBajos = await Product.countDocuments({ activo: true, $expr: { $lte: ["$stock", "$stock_minimo"] } });

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

  return {
    ventasDia: ventasDia[0]?.total || 0,
    ventasMes: ventasMes[0]?.total || 0,
    productosBajos,
    ganancias: ganancias[0]?.totalGanancia || 0,
    topProducts
  };
};
