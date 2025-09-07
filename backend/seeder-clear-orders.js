const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Order = require('./models/Order');

dotenv.config();

const clearOrders = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    console.log('✅ All orders removed');
    process.exit();
  } catch (error) {
    console.error('❌ Error clearing orders:', error);
    process.exit(1);
  }
};

clearOrders();
