const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        require: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

orderItemSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

orderItemSchema.set('toJSON', {
    virtuals: true
});

const OrderItems = mongoose.model('OrderItems', orderItemSchema);

module.exports = OrderItems;