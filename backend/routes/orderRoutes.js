const express = require("express");
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid, 
  updateOrderToDelivered, 
  getMyOrders,
  getOrders,
  createOrderFromCart,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/orders
// @access  Private
router.post("/", protect, addOrderItems);

// @route   POST /api/orders/from-cart
// @access  Private
router.post("/from-cart", protect, createOrderFromCart);

// @route   GET /api/orders/myorders
// @access  Private
router.get("/myorders", protect, getMyOrders);

// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, getOrderById);

// Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get("/", protect, admin, getOrders);

// @route   PUT /api/orders/:id/pay
// @access  Private
router.put("/:id/pay", protect, updateOrderToPaid);

// Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

module.exports = router;

