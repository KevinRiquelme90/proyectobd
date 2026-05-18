const express = require("express");
const { body, param, query } = require("express-validator");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("search").optional().isString(), query("page").optional().isInt({ min: 1 })],
  validateRequest,
  protect,
  listProducts
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  protect,
  getProduct
);

router.post(
  "/",
  protect,
  ensureRole(["ADMIN"]),
  [
    body("nombre").notEmpty().withMessage("Nombre requerido"),
    body("precio_compra").isFloat({ min: 0 }).withMessage("Precio de compra inválido"),
    body("precio_venta").isFloat({ min: 0 }).withMessage("Precio de venta inválido"),
    body("categoria").isMongoId().withMessage("Categoría inválida"),
    validateRequest
  ],
  createProduct
);

router.put(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  updateProduct
);

router.delete(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  deleteProduct
);

module.exports = router;