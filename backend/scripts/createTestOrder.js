const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Order = require("../models/Order");

// Optional: pass a userId as CLI arg: node scripts/createTestOrder.js <USER_ID>
const userIdFromArg = process.argv[2];

(async () => {
  try {
    await connectDB();

    const userId = userIdFromArg || new mongoose.Types.ObjectId(); // use existing userId if provided
    const productId = new mongoose.Types.ObjectId(); // placeholder

    const order = await Order.create({
      user: userId,
      orderItems: [
        {
          name: "Test Product",
          qty: 1,
          image: "/images/test.jpg",
          price: 10,
          product: productId,
        },
      ],
      shippingAddress: {
        address: "123 Test St",
        city: "New York",
        postalCode: "10001",
        country: "US",
      },
      paymentMethod: "Stripe",
      itemsPrice: 10,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 10,
      isPaid: false,
      isDelivered: false,
    });

    console.log("ORDER_ID:", order._id.toString());
    process.exit(0);
  } catch (err) {
    console.error("Create test order failed:", err);
    process.exit(1);
  }
})();