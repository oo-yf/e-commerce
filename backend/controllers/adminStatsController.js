const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Get basic dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalSales = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    users: totalUsers,
    orders: totalOrders,
    products: totalProducts,
    sales: totalSales[0]?.total || 0,
  });
});

// @desc    Get monthly sales stats
// @route   GET /api/admin/stats/monthly-sales
// @access  Private/Admin
const getMonthlySales = asyncHandler(async (req, res) => {
  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(monthlySales);
});

// @desc    Get monthly new users stats
// @route   GET /api/admin/stats/monthly-users
// @access  Private/Admin
const getMonthlyUsers = asyncHandler(async (req, res) => {
  const monthlyUsers = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(monthlyUsers);
});

// @desc    Get top 5 best-selling products
// @route   GET /api/admin/stats/top-products
// @access  Private/Admin
const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalQuantity: { $sum: "$orderItems.qty" },
        totalSales: {
          $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] },
        },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $project: {
        _id: 0,
        productId: "$productInfo._id",
        name: "$productInfo.name",
        totalQuantity: 1,
        totalSales: 1,
      },
    },
  ]);

  res.status(200).json(topProducts);
});

// @desc    Get sales distribution by product category
// @route   GET /api/admin/stats/category-sales
// @access  Private/Admin
const getCategorySales = asyncHandler(async (req, res) => {
  const categorySales = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.category",
        totalQuantity: { $sum: "$orderItems.qty" },
        totalSales: {
          $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] },
        },
      },
    },
    { $sort: { totalSales: -1 } },
  ]);

  res.status(200).json(categorySales);
});

module.exports = {
  getDashboardStats,
  getMonthlySales,
  getMonthlyUsers,
  getTopProducts,
  getCategorySales,
};