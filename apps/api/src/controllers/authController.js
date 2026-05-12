const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("role");

  if (!user) {
    return res.status(401).json({
      message: "Usuario no encontrado"
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(401).json({
      message: "Password incorrecta"
    });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user
  });
};