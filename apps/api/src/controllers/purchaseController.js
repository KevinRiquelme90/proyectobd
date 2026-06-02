const purchaseService = require("../services/purchaseService");

exports.createPurchase = async (req, res, next) => {
  try {
    const purchase = await purchaseService.createPurchase({
      usuario: req.user._id,
      proveedor: req.body.proveedor,
      items: req.body.items,
      total: req.body.total,
      nota: req.body.nota
    });
    res.status(201).json(purchase);
  } catch (error) {
    console.error("Error creating purchase:", error.message || error);
    next(error);
  }
};

exports.listPurchases = async (req, res, next) => {
  try {
    const result = await purchaseService.listPurchases(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
