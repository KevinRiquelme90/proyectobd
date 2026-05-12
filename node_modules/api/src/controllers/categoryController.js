const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ nombre: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo categorías"
    });
  }
};

module.exports = {
  getCategories
};
