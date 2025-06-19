const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
    }],
    shipping: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true }
    },
    payment: {
        method: { type: String, required: true }, // ex: cartão, boleto, etc
        total: { type: Number, required: true },
        status: { type: String, enum: ['pendente', 'autorizado', 'pago'], default: 'pendente' }
    },
    status: { type: String, enum: ['pendente', 'pago', 'enviado', 'entregue'], default: 'pendente' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
