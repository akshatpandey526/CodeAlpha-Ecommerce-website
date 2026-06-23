const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Upload to Cloudinary using upload_stream
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ecommerce_products' },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
                }
                res.status(200).json({
                    message: 'Image uploaded successfully',
                    url: result.secure_url
                });
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server upload error', error: error.message });
    }
});

module.exports = router;
