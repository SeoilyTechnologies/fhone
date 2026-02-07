const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      phone: user.phone || null,
      email: user.email || null,
      tokenVersion: user.tokenVersion
    },
    process.env.JWT_SEC,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
