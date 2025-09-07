const asyncHandler = require("express-async-handler");
const stripe = require("../config/stripe");

// @desc    Create a PaymentIntent for Stripe
// @route   POST /api/payment
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid payment amount");
  }

  // Stripe expects amount in the smallest currency unit (e.g., cents)
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: currency || "usd",
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = {
  createPaymentIntent,
};