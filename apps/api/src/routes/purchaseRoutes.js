const express = require("express");
const { body, query } = require("express-validator");
const { createPurchase, listPurchases } = require("../controllers/purchaseController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("search").optional().isString(), query("page").optional().isInt({ min: 1 })],
  validateRequest,
  protect,
  ensureRole(["ADMIN"]),
  listPurchases
);

router.post(
  "/",
  protect,
  ensureRole(["ADMIN"]),
  [
    body("proveedor").isMongoId().withMessage("Proveedor inválido"),
    body("items").isArray({ min: 1 }).withMessage("Debe agregar al menos un producto"),
    body("total").isFloat({ min: 0 }).withMessage("Total inválido"),
    validateRequest
  ],
  createPurchase
);

module.exports = router;
