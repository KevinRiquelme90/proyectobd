const express = require("express");
const { body, param, query } = require("express-validator");
const {
  openCashRegister,
  closeCashRegister,
  listCashRegisters
} = require("../controllers/cashRegisterController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("page").optional().isInt({ min: 1 }), query("estado").optional().isString()],
  validateRequest,
  protect,
  listCashRegisters
);

router.post(
  "/open",
  protect,
  ensureRole(["ADMIN", "CAJERO"]),
  [body("apertura").optional().isFloat({ min: 0 }), validateRequest],
  openCashRegister
);

router.post(
  "/close/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), body("saldo_final").isFloat({ min: 0 }), validateRequest],
  closeCashRegister
);

module.exports = router;
