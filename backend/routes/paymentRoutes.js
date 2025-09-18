const express = require('express');
const { createPaymentIntent, refundOrder } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route - user must be logged in to pay
router.post('/stripe', protect, createPaymentIntent);

// Admin refund endpoint
router.post('/refund', protect, admin, refundOrder);

module.exports = router;