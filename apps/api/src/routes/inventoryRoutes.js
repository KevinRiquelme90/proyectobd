const express = require("express");
const { query } = require("express-validator");
const { listInventory, listMovements } = require("../controllers/inventoryController");
const protect = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// Inventario actual (estado de stock de productos)
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("search").optional().isString(),
    query("lowStock").optional().isBoolean()
  ],
  validateRequest,
  protect,
  listInventory
);

// Movimientos históricos de inventario
router.get(
  "/movements",
  [query("page").optional().isInt({ min: 1 }), query("tipo").optional().isString()],
  validateRequest,
  protect,
  listMovements
);

module.exports = router;
