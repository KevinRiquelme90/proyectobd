const express = require("express");
const { body, param, query } = require("express-validator");
const {
  listClients,
  createClient,
  updateClient,
  deleteClient
} = require("../controllers/clientController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("search").optional().isString(), query("page").optional().isInt({ min: 1 })],
  validateRequest,
  protect,
  listClients
);

router.post(
  "/",
  protect,
  [body("nombre").notEmpty().withMessage("Nombre requerido"), validateRequest],
  createClient
);

router.put(
  "/:id",
  protect,
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  updateClient
);

router.delete(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  deleteClient
);

module.exports = router;
