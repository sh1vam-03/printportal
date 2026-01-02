import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "src/uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
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
