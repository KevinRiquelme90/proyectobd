const Category = require("../models/Category");

exports.listCategories = async () => {
  return Category.find({ activa: true }).sort({ nombre: 1 });
};

exports.createCategory = async (data) => {
  return Category.create(data);
};

exports.updateCategory = async (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteCategory = async (id) => {
  return Category.findByIdAndUpdate(id, { activa: false }, { new: true });
};
