const express = require("express");
const { body, param } = require("express-validator");
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/", protect, listCategories);

router.post(
  "/",
  protect,
  ensureRole(["ADMIN"]),
  [body("nombre").notEmpty().withMessage("Nombre requerido"), validateRequest],
  createCategory
);

router.put(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  updateCategory
);

router.delete(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  deleteCategory
);

module.exports = router;
