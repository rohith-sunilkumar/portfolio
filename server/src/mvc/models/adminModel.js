// src/models/adminModel.js
import bcrypt from 'bcryptjs';

// In-memory admin store
const admins = [];

export const createAdmin = async ({ username, email, password }) => {
  const existing = admins.find(a => a.email === email);
  if (existing) {
    throw new Error('Admin with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  admins.push(admin);

  // Return without password
  const { password: _, ...safeAdmin } = admin;
  return safeAdmin;
};

export const findAdminByEmail = (email) => {
  return admins.find(a => a.email === email);
};

export const findAdminById = (id) => {
  const admin = admins.find(a => a.id === id);
  if (!admin) return null;
  const { password: _, ...safeAdmin } = admin;
  return safeAdmin;
};

export const validatePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
