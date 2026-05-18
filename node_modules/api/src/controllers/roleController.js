const roleService = require("../services/roleService");

exports.listRoles = async (req, res, next) => {
  try {
    const roles = await roleService.listRoles();
    res.json(roles);
  } catch (error) {
    next(error);
  }
};
