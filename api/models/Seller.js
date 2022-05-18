const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const catalogSchema = Schema({
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catalogs: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
});


module.exports = Catalog = mongoose.model('Catalog', catalogSchema);