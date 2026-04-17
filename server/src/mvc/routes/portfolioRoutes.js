// src/routes/portfolioRoutes.js
import express from 'express';
import {
  getAllWork,
  getWorkById,
  getAllPlayground,
  getPlaygroundById
} from '../controllers/portfolioController.js';

const router = express.Router();

router.get('/work', getAllWork);
router.get('/work/:id', getWorkById);

router.get('/playground', getAllPlayground);
router.get('/playground/:id', getPlaygroundById);

export default router;
