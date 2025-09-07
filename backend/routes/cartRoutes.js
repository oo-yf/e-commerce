const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  saveCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Get user cart OR Save whole cart (sync)
router.route("/")
  .get(protect, getCart)      // GET /api/cart
  .post(protect, saveCart);   // POST /api/cart

// Add single item
router.post("/add", protect, addToCart); // POST /api/cart/add

// Update item quantity
router.put("/update/:productId", protect, updateCartItem); // PUT /api/cart/update/:productId

// Remove single item
router.delete("/remove/:productId", protect, removeCartItem); // DELETE /api/cart/remove/:productId

// Clear all items
router.delete("/clear", protect, clearCart); // DELETE /api/cart/clear

module.exports = router;