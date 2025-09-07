const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const formattedItems = orderItems.map(item => ({
    ...item,
    product: mongoose.Types.ObjectId.createFromHexString(item.product) // force convert to ObjectId
  }));

  const order = new Order({
    orderItems: formattedItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  };
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name email");
    res.json(orders);
};

// @desc    Create order from cart
// @route   POST /api/orders/from-cart
// @access  Private
const createOrderFromCart = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price image"
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const orderItems = cart.items.map((item) => ({
    name: item.product.name,
    qty: item.quantity,
    price: item.product.price,
    image: item.product.image || "default.jpg",
    product: item.product._id,
  }));

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    isPaid: false,
    isDelivered: false,
  });

  const createdOrder = await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json(createdOrder);
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders, 
  createOrderFromCart,
};