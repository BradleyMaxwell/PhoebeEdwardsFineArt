const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const Artwork = require('../models/artwork')
const Product = require('../models/product')
const { Basket } = require('../models/basket')

router.get('/', (req, res) => {
    res.render('basket')
})

router.post('/add', async (req, res) => {
    const product = await Product.findById(req.body.productId)
    const artwork = await Artwork.findById(product.artwork)

    // getting the artwork details that need to be displayed in the basket
    const relevantArtworkInfo = {
        title: artwork.title,
        image: artwork.imagePath
    }

    let size
    let selectedFraming = "Not Available"

    // getting print size ( if print ) or size of canvas for original
    if ( product.productType === "Print" ) {
        size = "A" + (5 - req.body.printChoice)
    } else {
        size = product.size
    }

    // getting framing option
    if ( product.framingPrice.length > 0 ) {
        selectedFraming = req.body.framingChoice
    }

    // price of the product
    let unitPrice = product.price[req.body.printChoice]

    if ( product.framingPrice.length > 0 && req.body.framingChoice !== "None" ) { // if the framing price length is not 0 then it has framing option
        const framingCost = product.framingPrice[req.body.printChoice]
        unitPrice += framingCost
    }

    // formatting the above gathered information into one json object to be added into the user's session basket
    basketItem = {
        productId: product.id,
        relevantArtworkInfo,    
        size,
        selectedFraming,
        unitPrice
    }

    // updating and saving the session basket 
    let basket = new Basket(req.session.basket.items)
    basket.add(basketItem)
    req.session.basket = basket
    req.session.save(err => {
        if (err) {
            console.log(err)
        }
    })
    console.log(req.session.basket)
})

module.exports = router