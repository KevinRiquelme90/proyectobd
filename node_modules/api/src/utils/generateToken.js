const jwt = require("jsonwebtoken");

const generateToken = (id, type = "access") => {
  const expiresIn = type === "refresh"
    ? process.env.JWT_REFRESH_EXPIRE || "30d"
    : process.env.JWT_EXPIRE || "7d";

  return jwt.sign(
    { id, type },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

module.exports = generateToken;