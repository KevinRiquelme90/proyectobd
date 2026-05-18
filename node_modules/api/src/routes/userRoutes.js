const express = require("express");
const { body, param, query } = require("express-validator");
const {
  listUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  protect,
  ensureRole(["ADMIN"]),
  [query("page").optional().isInt({ min: 1 }), query("search").optional().isString()],
  validateRequest,
  listUsers
);

router.post(
  "/",
  protect,
  ensureRole(["ADMIN"]),
  [
    body("nombre").notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Correo inválido"),
    body("password").isLength({ min: 6 }).withMessage("Contraseña de al menos 6 caracteres"),
    body("role").isMongoId().withMessage("Rol inválido"),
    validateRequest
  ],
  createUser
);

router.put(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  updateUser
);

router.delete(
  "/:id",
  protect,
  ensureRole(["ADMIN"]),
  [param("id").isMongoId().withMessage("ID inválido"), validateRequest],
  deleteUser
);

module.exports = router;
