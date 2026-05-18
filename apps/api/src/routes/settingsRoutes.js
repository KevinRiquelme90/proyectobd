const express = require("express");
const { body, param } = require("express-validator");
const { listSettings, updateSetting } = require("../controllers/settingsController");
const protect = require("../middlewares/authMiddleware");
const ensureRole = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/", protect, ensureRole(["ADMIN"]), listSettings);

router.put(
  "/:clave",
  protect,
  ensureRole(["ADMIN"]),
  [param("clave").notEmpty(), body("valor").exists(), validateRequest],
  updateSetting
);

module.exports = router;
