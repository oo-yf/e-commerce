const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc    Fetch all products with search & pagination
// @route   GET /api/products?keyword=xxx&page=2
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = 5; // number of products per page
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
};

// @desc    Fetch single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name || "Sample name",
    price: req.body.price || 0,
    user: req.user._id, // from authMiddleware
    image: req.body.image || "/images/sample.jpg",
    brand: req.body.brand || "Sample brand",
    category: req.body.category || "Sample category",
    countInStock: req.body.countInStock || 0,
    numReviews: 0,
    description: req.body.description || "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};