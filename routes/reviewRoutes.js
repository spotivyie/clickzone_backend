const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
    createReview,
    getProductReviews,
    deleteReview,
    updateReview
} = require('../controllers/reviewController');

router.post('/', verifyToken, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', verifyToken, deleteReview);
router.put('/:id', verifyToken, updateReview);

module.exports = router;
