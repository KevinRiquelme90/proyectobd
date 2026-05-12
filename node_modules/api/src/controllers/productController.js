const Product = require("../models/Product");

const getProducts = async (req, res) => {

  try {

    const products = await Product
      .find()
      .populate("categoria")
      .populate("proveedor")
      .sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo productos"
    });
  }
};

const createProduct = async (req, res) => {

  try {

    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {

    res.status(500).json({
      message: "Error creando producto"
    });
  }
};

module.exports = {
  getProducts,
  createProduct
};