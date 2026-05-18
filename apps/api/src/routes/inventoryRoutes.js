const express = require("express");
const { query } = require("express-validator");
const { listMovements } = require("../controllers/inventoryController");
const protect = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/",
  [query("page").optional().isInt({ min: 1 }), query("tipo").optional().isString()],
  validateRequest,
  protect,
  listMovements
);

module.exports = router;
