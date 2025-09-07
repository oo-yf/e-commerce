const express = require("express");
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/products
// @access  Public
router.get("/", getProducts);

// @route   GET /api/products/:id
// @access  Public
router.get("/:id", getProductById);

// Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, admin, createProduct);

// Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, admin, updateProduct);

// Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
