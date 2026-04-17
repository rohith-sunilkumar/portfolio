// src/routes/adminRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import {
  listPlaygroundItems,
  getPlaygroundItem,
  addPlaygroundItem,
  editPlaygroundItem,
  removePlaygroundItem
} from '../controllers/adminPlaygroundController.js';
import { updateSiteSettings, getPublicSettings } from '../controllers/settingsController.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';

const router = express.Router();

// All admin routes are protected
router.use(protect);

// Image upload
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/upload', deleteImage);

// Playground CRUD
router.get('/playground', listPlaygroundItems);
router.get('/playground/:id', getPlaygroundItem);
router.post('/playground', addPlaygroundItem);
router.put('/playground/:id', editPlaygroundItem);
router.delete('/playground/:id', removePlaygroundItem);

// Settings
router.get('/settings', getPublicSettings);
router.put('/settings', updateSiteSettings);

export default router;
