const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    console.log("Dados recebidos na criação do pedido:", req.body);
    console.log('Usuário criando pedido:', req.user);

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
        const { items, shipping, payment } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Itens do pedido não podem estar vazios' });
        }
        
        // Buscar preços reais dos produtos
        const enrichedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error('Produto não encontrado');

            // Verificar se há estoque suficiente
            if (product.stock < item.quantity) {
                throw new Error(`Estoque insuficiente para o produto ${product.name}`);
            }

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price, 
            };
        }));

        const newOrder = new Order({
            userId: req.user.id,
            items: enrichedItems,
            shipping,
            payment,
            status: 'pago',
        });

        const savedOrder = await newOrder.save();

        // Diminuir estoque de cada produto
        for (const item of enrichedItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Erro ao salvar pedido:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;

        const orders = await Order.find(isAdmin ? {} : { userId })
            .populate('items.productId', 'name image price')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('items.productId', 'name image price');

        if (!order) {
            return res.status(404).json({ msg: 'Pedido não encontrado' });
        }

        // Permitir acesso se for admin OU se for dono do pedido
        if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ msg: 'Acesso negado' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['pago', 'enviado', 'entregue'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Status inválido' });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ msg: 'Pedido não encontrado' });

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
