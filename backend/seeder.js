const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Find admin user to assign as product creator
    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      console.log("No admin user found. Please create one first.");
      process.exit();
    }

    const products = [
      {
        name: "iPhone 15",
        price: 999.99,
        description: "Apple flagship smartphone",
        countInStock: 50,
        image: "https://example.com/iphone15.jpg",
        category: "Electronics",
        brand: "Apple",
        user: adminUser._id,
      },
      {
        name: "Samsung Galaxy S24",
        price: 899.99,
        description: "Samsung flagship smartphone",
        countInStock: 40,
        image: "https://example.com/s24.jpg",
        category: "Electronics",
        brand: "Samsung",
        user: adminUser._id,
      },
      {
        name: "MacBook Pro 16",
        price: 2499.99,
        description: "Apple laptop with M3 chip",
        countInStock: 20,
        image: "https://example.com/mbp16.jpg",
        category: "Electronics",
        brand: "Apple",
        user: adminUser._id,
      },
      {
        name: "Sony WH-1000XM5",
        price: 399.99,
        description: "Noise cancelling headphones",
        countInStock: 70,
        image: "https://example.com/sony.jpg",
        category: "Electronics",
        brand: "Sony",
        user: adminUser._id,
      },
      {
        name: "Logitech MX Master 3S",
        price: 129.99,
        description: "Wireless mouse",
        countInStock: 100,
        image: "https://example.com/mxmaster.jpg",
        category: "Accessories",
        brand: "Logitech",
        user: adminUser._id,
      }
    ];

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Sample products inserted!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
