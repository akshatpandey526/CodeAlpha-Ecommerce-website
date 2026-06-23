const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../model/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: Math.round(amount * 100), // amount in paisa (1 INR = 100 paisa)
            currency: currency || 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const rzpOrder = await razorpay.orders.create(options);
        res.json(rzpOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Update order status in database
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'success',
                    update_time: Date.now().toString(),
                    email_address: req.user.email
                };
                const updatedOrder = await order.save();
                res.status(200).json({ message: 'Payment verified successfully', order: updatedOrder });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment
};
