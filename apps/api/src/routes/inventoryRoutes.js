const express = require("express");
const { body, query } = require("express-validator");
const { listInventory, listMovements, createMerma } = require("../controllers/inventoryController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
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

router.post(
  "/mermas",
  protect,
  ensureRole(["ADMIN"]),
  [
    body("producto").isMongoId().withMessage("Producto inválido"),
    body("cantidad").isFloat({ gt: 0 }).withMessage("Cantidad de merma inválida"),
    body("motivo").optional().isString(),
    body("fecha").optional().isISO8601().withMessage("Fecha inválida"),
    validateRequest
  ],
  createMerma
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
