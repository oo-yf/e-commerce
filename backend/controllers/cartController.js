const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate("items.product", "name price image");

  res.json({ items: cart.items });
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price image"
  );

  if (!cart) {
    return res.json({ items: [] });
  }

  const formattedItems = cart.items.map((i) => ({
    _id: i.product._id,
    name: i.product.name,
    price: i.product.price,
    image: i.product.image,
    qty: i.quantity,
  }));

  res.json({ items: formattedItems });
});

// @desc    Save whole cart (sync from frontend)
// @route   POST /api/cart
// @access  Private
const saveCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  cart.items = cartItems.map((item) => ({
    product:
      typeof item.product === "object"
        ? item.product._id
        : item.product || item._id,
    quantity: item.quantity || item.qty || 1,
  }));

  await cart.save();
  await cart.populate("items.product", "name price image");

  const formattedItems = cart.items.map((i) => ({
    _id: i.product._id,
    name: i.product.name,
    price: i.product.price,
    image: i.product.image,
    qty: i.quantity,
  }));

  res.json({ items: formattedItems });
});

// @desc    Update item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  await cart.populate("items.product", "name price image");

  res.json({ items: cart.items });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product", "name price image");

  res.json({ items: cart.items });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  await cart.save();

  res.json({ items: [] });
});

module.exports = {
  addToCart,
  getCart,
  saveCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};