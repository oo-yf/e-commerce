const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const crypto = require("crypto");

// Helper to create an idempotency key
function makeIdempotencyKey(userId, amount, orderId) {
  const raw = `${userId}:${amount}:${orderId}:${Date.now()}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// @desc    Create a PaymentIntent for Stripe
// @route   POST /api/payment
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body; // amount in USD, e.g. 123.45

  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }
  if (!amount || Number(amount) <= 0) {
    res.status(400);
    throw new Error("Valid amount is required");
  }

  const amountInCents = Math.round(Number(amount) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { orderId }, // critical: pass orderId for webhook
    // receipt_email: req.user?.email, // optional
  });

  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    orderId,
  });
});

const refundOrder = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body; // amount in USD (optional)

  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (!order.paymentResult?.id) {
    res.status(400);
    throw new Error("Order has no PaymentIntent id to refund");
  }

  const paymentIntentId = order.paymentResult.id;

  const params = { payment_intent: paymentIntentId };
  if (amount && Number(amount) > 0) {
    params.amount = Math.round(Number(amount) * 100);
  }

  const refund = await stripe.refunds.create(params);

  return res.status(201).json({ refund });
});

module.exports = { createPaymentIntent, refundOrder };