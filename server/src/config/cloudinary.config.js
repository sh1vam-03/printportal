import { v2 as cloudinary } from 'cloudinary';
// For Cloudinary Configuration
// Cloudinary auto-configures from CLOUDINARY_URL env variable
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME

if (!process.env.CLOUDINARY_URL) {
    console.warn('⚠️  CLOUDINARY_URL not found in environment variables. File uploads will fail.');
} else {
    console.log('✅ Cloudinary configured successfully');
}

export default cloudinary;
