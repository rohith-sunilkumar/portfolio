// src/models/settingsModel.js

// In-memory site settings store
let siteSettings = {
  heroImage: '/pTliQDNkL6D6AXQESYbLMpkK8U.jpg', // default hero image
  heroImageType: 'local' // 'local' or 'url'
};

export const getSettings = () => {
  return { ...siteSettings };
};

export const updateSettings = (updates) => {
  siteSettings = { ...siteSettings, ...updates };
  return { ...siteSettings };
};
