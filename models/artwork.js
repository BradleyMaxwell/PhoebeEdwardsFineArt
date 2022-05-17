const mongoose = require('mongoose')
const Product = require('./product')

const artworkSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    context: {
        type: String
    },
    gallery: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gallery'
    },
    image: {
        type: Buffer,
        required: true,
    },
    imageType: { // need to know when rendering
        type: String,
        required: true
    },
    showInGallery: {
        type: Boolean,
        required: true
    },
    isPreview: {
        type: Boolean,
        default: false
    }
    
})

artworkSchema.virtual('imagePath').get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

artworkSchema.pre('remove', async function(next) { // delete the shop products that are linked to the artwork that just got deleted
    const artwork = this
    await Product.deleteMany({ artwork: artwork.id })
    next()
})

module.exports = mongoose.model('Artwork',artworkSchema)