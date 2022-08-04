const { shallowCopy } = require('ejs/lib/utils')
const express = require('express')
const router = express.Router()
const Artwork = require('../models/artwork')
const Product = require('../models/product')

router.get('/', async (req, res) => {
    try {
        const productsWithImage = []
        
        const products = await Product.find({}).sort( { artwork: 'asc' })
        for (let current = 0; current < products.length; current++) { 
            const currentProduct = products[current]
            const currentArtwork = await Artwork.findById(currentProduct.artwork)

            const data = [currentProduct, currentArtwork]
            productsWithImage.push(data)
        }

        res.render('shop/index', { productsWithImage: productsWithImage })
    }
    catch {
        res.redirect('/')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        const artwork = await Artwork.findById(product.artwork)

        res.render('shop/show', { product: product, artwork: artwork })
    }
    catch (err) {
        console.log(err)
        res.redirect('/shop')
    }
})

module.exports = router