const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyRazorpayPayment
} = require('../controlers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
