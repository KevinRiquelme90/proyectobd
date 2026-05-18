const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "No autorizado"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("role");

    if (!user || !user.activo) {
      return res.status(401).json({
        message: "No autorizado"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido"
    });
  }
};

module.exports = protect;