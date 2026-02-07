const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token)
      return res.status(401).json({ message: 'Token missing or malformed' });

    const payload = jwt.verify(token, process.env.JWT_SEC);

    const user = await User.findById(payload.id).select('tokenVersion isPhoneVerified');
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (user.tokenVersion !== payload.tokenVersion)
      return res.status(401).json({ message: 'Session expired. Please login again.' });

    req.user = {
      id: payload.id,
      phone: payload.phone,
      email: payload.email
    };

    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


