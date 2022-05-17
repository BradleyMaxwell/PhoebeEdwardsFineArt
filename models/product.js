const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artwork'
    },
    productType: {
        type: String,
        required: true
    },
    price: {
        type: [Number],
        required: true
    },
    mediums: {
        type: String
    },
    size: {
        type: String
    },
    framingPrice: {
        type: [Number]
    }
})

module.exports = mongoose.model('Product',productSchema)