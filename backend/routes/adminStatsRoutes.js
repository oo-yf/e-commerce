const express = require('express');
const {
    getDashboardStats,
    getMonthlySales,
    getMonthlyUsers,
    getTopProducts,
    getCategorySales
} = require('../controllers/adminStatsController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Basic stats
router.get('/stats', protect, admin, getDashboardStats);

// Monthly sales stats
router.get('/stats/monthly-sales', protect, admin, getMonthlySales);

// Monthly new users stats
router.get('/stats/monthly-users', protect, admin, getMonthlyUsers);

// Top 5 best-selling products
router.get('/stats/top-products', protect, admin, getTopProducts);

// Sales distribution by category
router.get('/stats/category-sales', protect, admin, getCategorySales);

module.exports = router;