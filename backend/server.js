const path = require("path");
const dotenv = require("dotenv");

// ✅ Force load .env file from project root
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminStatsRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Middleware for 404 & error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});