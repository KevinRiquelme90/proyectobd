const inventoryService = require("../services/inventoryService");

exports.listInventory = async (req, res, next) => {
  try {
    const result = await inventoryService.listInventory(req.query);
    res.json(result);
  } catch (error) {
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
