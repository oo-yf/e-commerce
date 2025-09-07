const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route - user must be logged in to pay
router.post('/stripe', protect, createPaymentIntent);

module.exports = router;
