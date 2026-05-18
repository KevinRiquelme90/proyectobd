const express = require("express");
const { body } = require("express-validator");
const {
  login,
  refreshToken,
  logout,
  profile
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Correo inválido"),
    body("password").notEmpty().withMessage("Contraseña requerida"),
    validateRequest
  ],
  login
);

router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token requerido"), validateRequest],
  refreshToken
);

router.post("/logout", protect, logout);
router.get("/me", protect, profile);

module.exports = router;
