import { v2 as cloudinary } from 'cloudinary';

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

if (!config.api_key) {
  console.error('❌ Cloudinary API key missing. Check your .env file.');
  console.error('Config:', config);
}

cloudinary.config(config);

export default cloudinary;
