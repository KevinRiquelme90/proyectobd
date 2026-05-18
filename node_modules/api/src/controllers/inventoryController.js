const inventoryService = require("../services/inventoryService");

exports.listMovements = async (req, res, next) => {
  try {
    const result = await inventoryService.listMovements(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
