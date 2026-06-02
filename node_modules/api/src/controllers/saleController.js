const saleService = require("../services/saleService");

exports.createSale = async (req, res, next) => {
  try {
    const sale = await saleService.createSale({
      usuario: req.user._id,
      cliente: req.body.cliente || null,
      metodo_pago: req.body.metodo_pago,
      items: req.body.items,
      total: req.body.total
    });
    res.status(201).json({ 
      success: true,
      message: "Venta registrada correctamente",
      sale 
    });
  } catch (error) {
    console.error("Error creando venta:", error);
    next(error);
  }
};

exports.listSales = async (req, res, next) => {
  try {
    const result = await saleService.listSales(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
