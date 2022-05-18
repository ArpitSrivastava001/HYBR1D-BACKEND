const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    buyer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
        }
    ]
});

module.exports = Order = mongoose.model('Order', OrderSchema);