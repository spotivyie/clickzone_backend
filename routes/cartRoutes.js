const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    updateShippingCostByRegion
} = require('../controllers/cartController');

router.get('/', verifyToken, getCart);
router.post('/items', verifyToken, addItemToCart);
router.put('/items/:productId', verifyToken, updateItemQuantity);
router.delete('/items/:productId', verifyToken, removeItemFromCart);
router.put('/shipping', verifyToken, updateShippingCostByRegion);

module.exports = router;
