const categoryService = require("../services/categoryService");

exports.listCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    next(error);
  }
};
