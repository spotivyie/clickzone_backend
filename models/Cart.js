const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    shippingCost: { type: Number, default: 0 },
    shippingRegion: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
