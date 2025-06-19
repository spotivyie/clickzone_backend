const Product = require('../models/Product');

//criar produto
exports.createProduct = async (req, res) => {
    console.log('Recebendo requisição para criar produto');
    console.log('Body recebido:', req.body);

    try {
        if (req.body.category) {
            req.body.category = capitalizeFirstLetter(req.body.category.trim());
        }
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
};

// Listar todos os produtos (público)
function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, minPrice, maxPrice, sort, name } = req.query;
        const filter = {};

        if (category) {
            filter.category = capitalizeFirstLetter(category.trim());
        }
        if (name) {
            filter.name = { $regex: name.trim(), $options: 'i' };
        }
        if (minPrice) {
            filter.price = { ...filter.price, $gte: Number(minPrice) };
        }
        if (maxPrice) {
            filter.price = { ...filter.price, $lte: Number(maxPrice) };
        }

        // Ordenar por mais recentes, se sort=newest
        const sortOption = sort === 'newest' ? { createdAt: -1 } : {};

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Buscar produto por ID (público)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar produto (admin)
exports.updateProduct = async (req, res) => {
    try {
        if (req.body.category) {
            req.body.category = capitalizeFirstLetter(req.body.category.trim());
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar produto (admin)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Rota para pegar categorias distintas
exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
