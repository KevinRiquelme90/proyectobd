const Role = require("../models/Role");

exports.listRoles = async () => {
  return Role.find().sort({ nombre: 1 });
};
