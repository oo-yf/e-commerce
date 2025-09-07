const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const clearData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    console.log("Database cleared!");
    process.exit();
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
};

clearData();
