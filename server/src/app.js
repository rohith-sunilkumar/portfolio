// src/app.js
import express from 'express';
import cors from 'cors';
import portfolioRoutes from './mvc/routes/portfolioRoutes.js';
import authRoutes from './mvc/routes/authRoutes.js';
import adminRoutes from './mvc/routes/adminRoutes.js';
import { getPublicSettings } from './mvc/controllers/settingsController.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/portfolio', portfolioRoutes);
app.get('/api/settings', getPublicSettings);

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes (protected)
app.use('/api/admin', adminRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: "Portfolio API is running" });
});

export default app;
