const Cart = require('../models/Cart');

const shippingRates = {
    norte: 50,
    nordeste: 40,
    sudeste: 30,
    sul: 35,
    centrooeste: 45,
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) return res.json({ items: [], shippingCost: 0, shippingRegion: '', total: 0 });

        // Calcula subtotal por item e total
        const items = cart.items.map(item => {
        const subtotal = item.productId.price * item.quantity;
        return {
            product: item.productId,
            quantity: item.quantity,
            subtotal,
        };
        });

        const totalItemsPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
        const total = totalItemsPrice + cart.shippingCost;

        res.json({
            items,
            shippingCost: cart.shippingCost,
            shippingRegion: cart.shippingRegion,
            total,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
        cart = new Cart({
            userId: req.user.id,
            items: [{ productId, quantity }],
        });
        } else {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateShippingCostByRegion = async (req, res) => {
    try {
        const { region } = req.body;
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Carrinho não encontrado' });

        const cost = shippingRates[region.toLowerCase()];
        if (!cost) return res.status(400).json({ msg: 'Região inválida para frete' });

        cart.shippingCost = cost;
        cart.shippingRegion = region.toLowerCase();
        await cart.save();

        res.json({ shippingCost: cost, region: region.toLowerCase() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Carrinho não encontrado' });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ msg: 'Produto não encontrado no carrinho' });

        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    const { productId } = req.params;
    console.log('ProductId para remover:', productId);

    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Carrinho não encontrado' });

        console.log('Itens antes da remoção:', cart.items.map(i => i.productId.toString()));

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        console.log('Itens após a remoção:', cart.items.map(i => i.productId.toString()));

        await cart.save();

        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

