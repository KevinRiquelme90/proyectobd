const Client = require("../models/Client");

exports.listClients = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.search) {
    query.$or = [
      { nombre: new RegExp(options.search, "i") },
      { telefono: new RegExp(options.search, "i") },
      { email: new RegExp(options.search, "i") }
    ];
  }

  const clients = await Client.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Client.countDocuments(query);

  return { clients, total, page, pages: Math.ceil(total / limit) };
};

exports.createClient = async (data) => {
  return Client.create(data);
};

exports.updateClient = async (id, data) => {
  return Client.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteClient = async (id) => {
  return Client.findByIdAndDelete(id);
};
