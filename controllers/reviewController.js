const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    const { product, rating, comment } = req.body;
    const user = req.user.id;

    try {
        const existingReview = await Review.findOne({ product, user });
        if (existingReview) {
            return res.status(400).json({ message: 'Você já avaliou este produto.' });
        }

        const review = await Review.create({ product, user, rating, comment });
        const populatedReview = await review.populate('user', 'name image');

        res.status(201).json(populatedReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name image')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada.' });
        }

        const isAuthor = review.user.toString() === req.user.id;
        const isAdmin = req.user.isAdmin;

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar esta avaliação.' });
        }

        await review.deleteOne();

        res.json({ message: 'Avaliação deletada com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada.' });
        }

        const isAuthor = review.user.toString() === req.user.id;
        const isAdmin = req.user.isAdmin;

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: 'Você não tem permissão para editar esta avaliação.' });
        }

        if (req.body.rating !== undefined) review.rating = req.body.rating;
        if (req.body.comment !== undefined) review.comment = req.body.comment;

        await review.save();

        review = await Review.findById(review._id).populate('user', 'name image');

        res.json({ message: 'Avaliação atualizada com sucesso.', review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
