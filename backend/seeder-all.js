const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    console.log("Old data removed!");

    // Create sample users
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: bcrypt.hashSync("123456", 10),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: bcrypt.hashSync("123456", 10),
      },
    ];

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log("Sample users created!");

    // Create sample products
    const products = [
      {
        name: "iPhone 15",
        price: 999.99,
        description: "Apple flagship smartphone",
        countInStock: 50,
        image: "https://example.com/iphone15.jpg",
        category: "Electronics",
        brand: "Apple",
        user: adminUser,
      },
      {
        name: "Samsung Galaxy S24",
        price: 899.99,
        description: "Samsung flagship smartphone",
        countInStock: 40,
        image: "https://example.com/s24.jpg",
        category: "Electronics",
        brand: "Samsung",
        user: adminUser,
      },
      {
        name: "Sony WH-1000XM5",
        price: 399.99,
        description: "Noise cancelling headphones",
        countInStock: 70,
        image: "https://example.com/sony.jpg",
        category: "Electronics",
        brand: "Sony",
        user: adminUser,
      },
    ];

    await Product.insertMany(products);

    console.log("Sample products created!");
    process.exit();
  } catch (error) {
    console.error("Error with data seeding:", error);
    process.exit(1);
  }
};

importData();
