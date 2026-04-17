// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/keys.js';

// Hardcoded admin ID
const ADMIN_ID = 'admin-001';
const ADMIN_USERNAME = 'Admin';
const ADMIN_EMAIL = 'admin@portfolio.com';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if decoded ID matches the hardcoded admin ID
    if (decoded.id !== ADMIN_ID) {
      return res.status(401).json({ message: 'Not authorized, invalid admin' });
    }

    req.admin = {
      id: ADMIN_ID,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
