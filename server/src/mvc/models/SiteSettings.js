// src/models/SiteSettings.js
import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'main',
    unique: true
  },
  heroImage: {
    type: String,
    default: '/pTliQDNkL6D6AXQESYbLMpkK8U.jpg'
  },
  heroImageType: {
    type: String,
    enum: ['local', 'url'],
    default: 'local'
  },
  altHeroImage: {
    type: String,
    default: '/pTliQDNkL6D6AXQESYbLMpkK8U.jpg'
  },
  altHeroImageType: {
    type: String,
    enum: ['local', 'url'],
    default: 'local'
  },
  showcaseSlides: {
    type: [{
      url: { type: String, trim: true, default: '' },
      alt: { type: String, trim: true, default: 'Showcase' }
    }],
    default: []
  },
  adminProfileImage: {
    type: String,
    default: ''
  },
  adminProfileImagePublicId: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
