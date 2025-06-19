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



// const express = require('express');
// const router = express.Router();
// const Review = require('../models/Review');
// const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, async (req, res) => {
//     const { product, rating, comment } = req.body;
//     const user = req.user.id;

//     try {
//         // Verifica se o usuário já avaliou o produto
//         const existingReview = await Review.findOne({ product, user });
//         if (existingReview) {
//             return res.status(400).json({ message: 'Você já avaliou este produto.' });
//         }

//         // Aqui você cria o review e popula o user para enviar junto no response
//         const review = await Review.create({ product, user, rating, comment });
//         const populatedReview = await review.populate('user', 'name image');

//         res.status(201).json(populatedReview);

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// router.get('/product/:productId', async (req, res) => {
//     try {
//         const reviews = await Review.find({ product: req.params.productId })
//             .populate('user', 'name image') 
//             .sort({ createdAt: -1 });

//         res.json(reviews);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Deletar uma avaliação
// router.delete('/:id', verifyToken, async (req, res) => {
//     try {
//         const review = await Review.findById(req.params.id);

//         if (!review) {
//             return res.status(404).json({ message: 'Avaliação não encontrada.' });
//         }

//         // Verifica se o usuário logado é o autor ou admin
//         const isAuthor = review.user.toString() === req.user.id;
//         const isAdmin = req.user.isAdmin;

//         if (!isAuthor && !isAdmin) {
//             return res.status(403).json({ message: 'Você não tem permissão para deletar esta avaliação.' });
//         }

//         await review.deleteOne();

//         res.json({ message: 'Avaliação deletada com sucesso.' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Editar avaliação
// router.put('/:id', verifyToken, async (req, res) => {
//     try {
//         let review = await Review.findById(req.params.id);

//         if (!review) {
//             return res.status(404).json({ message: 'Avaliação não encontrada.' });
//         }

//         const isAuthor = review.user.toString() === req.user.id;
//         const isAdmin = req.user.isAdmin;

//         if (!isAuthor && !isAdmin) {
//             return res.status(403).json({ message: 'Você não tem permissão para editar esta avaliação.' });
//         }

//         // Atualiza apenas os campos enviados
//         if (req.body.rating !== undefined) review.rating = req.body.rating;
//         if (req.body.comment !== undefined) review.comment = req.body.comment;

//         await review.save();

//         // Popula user para enviar junto no retorno
//         review = await Review.findById(review._id).populate('user', 'name image');

//         res.json({ message: 'Avaliação atualizada com sucesso.', review });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
