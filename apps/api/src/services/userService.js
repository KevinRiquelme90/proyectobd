const User = require("../models/User");

exports.listUsers = async (options = {}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const query = {};

  if (options.search) {
    query.$or = [
      { nombre: new RegExp(options.search, "i") },
      { email: new RegExp(options.search, "i") }
    ];
  }

  const users = await User.find(query)
    .populate("role")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  return { users, total, page, pages: Math.ceil(total / limit) };
};

exports.createUser = async (data) => {
  return User.create(data);
};

exports.updateUser = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};
