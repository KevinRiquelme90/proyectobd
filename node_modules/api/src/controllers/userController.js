const userService = require("../services/userService");

exports.listUsers = async (req, res, next) => {
  try {
    const result = await userService.listUsers(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    next(error);
  }
};
