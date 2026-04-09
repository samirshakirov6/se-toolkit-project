const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'workout-tracker-secret-key-2026';

function authMiddleware(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};
