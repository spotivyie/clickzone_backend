const express = require('express');
const router = express.Router();
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware');
const {
    getStats,
    getOrdersByMonth,
    getMonthlySummary
} = require('../controllers/adminDashboardController');

router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/orders/list-by-month', verifyToken, isAdmin, getOrdersByMonth);
router.get('/orders-by-month', verifyToken, isAdmin, getMonthlySummary);

module.exports = router;
