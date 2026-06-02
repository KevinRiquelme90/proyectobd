const inventoryService = require("../services/inventoryService");

exports.listInventory = async (req, res, next) => {
  try {
    const result = await inventoryService.listInventory(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createMerma = async (req, res, next) => {
  try {
    const movement = await inventoryService.createMerma({
      usuario: req.user._id,
      producto: req.body.producto,
      cantidad: req.body.cantidad,
      motivo: req.body.motivo,
      fecha: req.body.fecha
    });
    res.status(201).json(movement);
  } catch (error) {
    console.error("Error creating merma:", error.message || error);
    next(error);
  }
};

exports.listMovements = async (req, res, next) => {
  try {
    const result = await inventoryService.listMovements(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
