import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Extract organization from authenticated user
        const orgId = req.user?.organizationId || 'default';

        return {
            folder: `printportal/${orgId}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt', 'md'],
            resource_type: 'auto', // Handles both images and raw files (PDFs, docs)
        };
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            // Images
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            // Documents
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            // Text/Code
            'text/plain', 'text/markdown'
        ];

        // Also check extensions for md files which might have varied mime types
        const isMd = file.originalname.toLowerCase().endsWith('.md');

        if (allowedMimes.includes(file.mimetype) || isMd) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, Word docs, and text files are allowed.'));
        }
    }
});

// ✅ Error handling wrapper
export const handleUpload = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size must be less than 10MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error uploading file'
            });
        }
        next();
    });
};
