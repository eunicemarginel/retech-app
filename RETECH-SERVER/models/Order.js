const mongoose = require('mongoose');

//[SECTION] Schema/Blueprint 
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is Required']
    },
    orderedProducts: [
        {
            productId: {
                type: String,
                required: [true, 'Product ID is Required']
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, 'totalPrice is Required']
    },
    orderedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Ordered'
    }
});

//[SECTION] Model
module.exports = mongoose.model('Ordered', orderSchema);