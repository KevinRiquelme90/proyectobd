const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");

    if (!user || !user.activo) {
      return res.status(401).json({ message: "Usuario o contraseña inválidos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Usuario o contraseña inválidos" });
    }

    const token = generateToken(user._id, "access");
    const refreshToken = generateToken(user._id, "refresh");

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      refreshToken,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token requerido" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Refresh token inválido" });
    }

    const user = await User.findById(decoded.id).populate("role");
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token inválido" });
    }

    const token = generateToken(user._id, "access");
    const nextRefresh = generateToken(user._id, "refresh");

    user.refreshToken = nextRefresh;
    await user.save();

    res.json({ token, refreshToken: nextRefresh, user });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({ message: "Sesión cerrada" });
  } catch (error) {
    next(error);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("role");
    res.json(user);
  } catch (error) {
    next(error);
  }
};