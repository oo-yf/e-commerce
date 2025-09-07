const Stripe = require('stripe');

// Initialize Stripe with secret key from .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
