// src/controllers/settingsController.js
import SiteSettings from '../models/SiteSettings.js';

// Public — frontend fetches this
export const getPublicSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'main' });
    if (!settings) {
      settings = await SiteSettings.create({ key: 'main' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin — update settings
export const updateSiteSettings = async (req, res) => {
  try {
    const body = { ...req.body };
    if (Array.isArray(body.showcaseSlides)) {
      body.showcaseSlides = body.showcaseSlides
        .map((s) => ({
          url: (s?.url || '').trim(),
          alt: (s?.alt || 'Showcase').trim() || 'Showcase'
        }))
        .filter((s) => s.url.length > 0);
    }
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
