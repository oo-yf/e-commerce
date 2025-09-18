const express = require("express");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order"); // <-- add this

const router = express.Router();

/**
 * First: verify Stripe signature with raw body
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      req.stripeEvent = event;
      return next();
    } catch (err) {
      console.error("❌ Stripe signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
  /**
   * Second: business logic
   */
  asyncHandler(async (req, res) => {
    const event = req.stripeEvent;
    console.log("✅ Webhook received:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const orderId = pi?.metadata?.orderId;
      if (!orderId) {
        console.warn("⚠️ payment_intent.succeeded without metadata.orderId");
        return res.json({ received: true, warning: "missing orderId" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        console.warn(`⚠️ Order not found for id ${orderId}`);
        return res.json({ received: true, warning: "order not found" });
      }

      if (!order.isPaid) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: pi.id,
            status: pi.status,
            update_time: new Date(),
            email_address: pi.receipt_email || null,
          },
        });
        console.log(`🟩 Order ${orderId} marked as paid via webhook.`);
      } else {
        console.log(`ℹ️ Order ${orderId} already paid; skipping update.`);
      }
    }

    // handle payment failure
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object;
      const orderId = pi?.metadata?.orderId;
      const lastError = pi?.last_payment_error?.message || "Payment failed";

      if (!orderId) {
        console.warn("⚠️ payment_intent.payment_failed without metadata.orderId");
        return res.json({ received: true, warning: "missing orderId" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        console.warn(`⚠️ Order not found for id ${orderId}`);
        return res.json({ received: true, warning: "order not found" });
      }

      // Do not flip isPaid; just record the error/status for UI
      await Order.findByIdAndUpdate(orderId, {
        paymentResult: {
          id: pi.id,
          status: pi.status || "failed",
          update_time: new Date(),
          error_message: lastError,
          email_address: pi.receipt_email || null,
        },
      });

      console.log(`🟥 Payment failed for order ${orderId}: ${lastError}`);
    }

    // handle refund completed
    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      // The original PaymentIntent id is on the charge
      const piId = charge.payment_intent;
      
      const pi = await stripe.paymentIntents.retrieve(piId);
      const orderId = pi?.metadata?.orderId;

      if (!orderId) {
        console.warn("⚠️ charge.refunded without metadata.orderId on PaymentIntent");
        return res.json({ received: true, warning: "missing orderId for refund" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        console.warn(`⚠️ Order not found for refund id ${orderId}`);
        return res.json({ received: true, warning: "order not found" });
      }

      await Order.findByIdAndUpdate(orderId, {
        isRefunded: true,
        refundedAt: new Date(),
        refundResult: {
          id: charge.id,
          status: "refunded",
          amount: charge.amount_refunded,
          currency: charge.currency,
          update_time: new Date(),
        },
      });

      console.log(`🟦 Order ${orderId} marked as refunded via webhook.`);
    }

    return res.json({ received: true });
  })
);

module.exports = router;