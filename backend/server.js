const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Connect to MongoDB
connectDB();

const app = express();

// --- Stripe Webhook
const paymentWebhookRoutes = require("./routes/paymentWebhookRoutes");
app.use("/api/payments", paymentWebhookRoutes);

// --- Common Middlewares ---
app.use(cors());
app.use(express.json());

// --- Normal Routes ---
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes); // PaymentIntent creation
app.use("/api/admin", adminStatsRoutes);

// --- Root Route ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});