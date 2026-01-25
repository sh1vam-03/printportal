import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Extract organization from authenticated user
        const orgId = req.user?.organizationId || 'default';

        // Determine resource type: 'image' for images, 'raw' for all documents
        const isImage = file.mimetype.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';

        return {
            folder: `printportal/${orgId}`,
            resource_type: resourceType, // Critical: 'raw' for documents, 'image' for images
            allowed_formats: [
                'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp',
                'pdf', 'doc', 'docx', 'odt', 'rtf',
                'xls', 'xlsx', 'csv',
                'ppt', 'pptx',
                'txt', 'md',
                'zip'
            ],
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
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp',
            // Documents
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.oasis.opendocument.text', // .odt
            'application/rtf', // .rtf
            // Spreadsheets
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'text/csv', // .csv
            // Presentations
            'application/vnd.ms-powerpoint', // .ppt
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
            // Text/Code
            'text/plain', 'text/markdown',
            // Archives
            'application/zip', 'application/x-zip-compressed'
        ];

        // Also check extensions for files with varied/unknown mime types
        const fileName = file.originalname.toLowerCase();
        const allowedExtensions = ['.md', '.csv', '.txt', '.rtf', '.zip'];
        const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (allowedMimes.includes(file.mimetype) || hasAllowedExtension) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Audio and video files are not allowed. Only documents, images, and spreadsheets are supported.'));
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
