// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../../config/keys.js';

// Hardcoded admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';
const ADMIN_ID = 'admin-001';
const ADMIN_USERNAME = 'Admin';

const generateToken = (id) => {
  const secret = JWT_SECRET || 'portfolio-admin-secret-key-2026';
  const expiresIn = JWT_EXPIRY || '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};

export const login = async (req, res) => {
  try {
    const body = req.body || {};
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Verify against hardcoded credentials
    if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(ADMIN_ID);

    res.json({
      id: ADMIN_ID,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = (req, res) => {
  res.json(req.admin);
};
