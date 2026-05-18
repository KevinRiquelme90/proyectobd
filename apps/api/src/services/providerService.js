const Provider = require("../models/Provider");

exports.listProviders = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.search) {
    query.$or = [
      { nombre_empresa: new RegExp(options.search, "i") },
      { contacto: new RegExp(options.search, "i") },
      { email: new RegExp(options.search, "i") }
    ];
  }

  const providers = await Provider.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Provider.countDocuments(query);

  return { providers, total, page, pages: Math.ceil(total / limit) };
};

exports.createProvider = async (data) => {
  return Provider.create(data);
};

exports.updateProvider = async (id, data) => {
  return Provider.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteProvider = async (id) => {
  return Provider.findByIdAndDelete(id);
};
