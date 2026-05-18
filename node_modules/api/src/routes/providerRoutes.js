const express = require("express");
const { body, param, query } = require("express-validator");
const {
  listProviders,
  createProvider,
  updateProvider,
  deleteProvider
} = require("../controllers/providerController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("search").optional().isString(), query("page").optional().isInt({ min: 1 })],
  validateRequest,
  protect,
  listProviders
);

router.post(
  "/",
  protect,
  ensureRole(["ADMIN"]),
  [body("nombre_empresa").notEmpty().withMessage("Nombre requerido"), validateRequest],
  createProvider
);

router.put(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  updateProvider
);

router.delete(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  deleteProvider
);

module.exports = router;
