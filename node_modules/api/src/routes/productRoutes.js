const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts
} = require("../controllers/productController");

const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createProduct);

router.get("/", protect, getProducts);

module.exports = router;