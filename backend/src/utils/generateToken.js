const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const generateToken = (user) => {
  if (!jwtConfig.secret) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
};

module.exports = generateToken;