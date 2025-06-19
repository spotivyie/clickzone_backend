const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
    createOrder,
    getOrders,
    getOrderDetails,
    updateOrderStatus,
} = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:orderId', verifyToken, getOrderDetails);
router.put('/:orderId/status', verifyToken, updateOrderStatus);

module.exports = router;
