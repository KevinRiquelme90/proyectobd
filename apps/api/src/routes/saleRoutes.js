const express = require("express");
const { body, query } = require("express-validator");
const { createSale, listSales } = require("../controllers/saleController");
const protect = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("search").optional().isString(), query("page").optional().isInt({ min: 1 })],
  validateRequest,
  protect,
  listSales
);

router.post(
  "/",
  protect,
  [
    body("cliente").optional().isMongoId().withMessage("Cliente inválido"),
    body("metodo_pago")
      .notEmpty().withMessage("Método de pago requerido")
      .isIn(["efectivo", "debito", "credito", "transferencia"]).withMessage("Método de pago inválido"),
    body("items").isArray({ min: 1 }).withMessage("Debe agregar al menos un producto"),
    body("items.*.producto").isMongoId().withMessage("ID de producto inválido"),
    body("items.*.cantidad").isInt({ min: 1 }).withMessage("Cantidad debe ser mayor a 0"),
    body("items.*.precio").isFloat({ min: 0 }).withMessage("Precio inválido"),
    body("items.*.subtotal").isFloat({ min: 0 }).withMessage("Subtotal inválido"),
    body("total").isFloat({ min: 0 }).withMessage("Total inválido"),
    validateRequest
  ],
  createSale
);

module.exports = router;
