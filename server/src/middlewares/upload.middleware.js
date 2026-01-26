import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Generate a unique public_id
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const name = path.basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();

        return {
            folder: 'print_portal_uploads',
            resource_type: 'auto', // Important for PDFs, Docs, etc.
            type: 'private', // Access control: Private
            public_id: `${name}-${uniqueSuffix}`,
            // format: path.extname(file.originalname).substring(1) // optional: force format or keep original
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
            'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/bmp',
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
        ];

        // Allowed Extensions (Double check)
        const allowedExtensions = [
            '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv',
            '.txt', '.md', '.rtf', '.odt',
            '.jpg', '.jpeg', '.png', '.webp', '.svg'
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        // EXPLICIT BLOCKS
        const blockedExtensions = ['.zip', '.rar', '.7z', '.exe', '.sh', '.mp4', '.mp3', '.gif', '.wav', '.mov', '.avi'];
        if (blockedExtensions.includes(ext)) {
            return cb(new Error('File type not allowed. No Archives, Video, Audio, or GIF.'));
        }

        if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only standard documents and images allowed.'));
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
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Error uploading file'
            });
        }
        next();
    });
};
