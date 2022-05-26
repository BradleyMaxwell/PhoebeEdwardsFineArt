const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const Artwork = require('../models/artwork')
const Product = require('../models/product')
const { Basket } = require('../models/basket')
const session = require('express-session')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

router.get('/', async (req, res) => {
    let basket = []
    let totalPrice = 0

    for (let currentItem = 0; currentItem < req.session.basket.items.length; currentItem++) { // go through all the products in the session basket and create objects to display info in basket
        const item = req.session.basket.items[currentItem] // item in the session basket
        const product = await Product.findById(item.productId) // info stored about the product on the server
        const artwork = await Artwork.findById(product.artwork) // the artwork linked to the product
        // get the size in the correct format to display rather than just an index
        let size
        if (product.productType === "Print") {
            size = "A" + (5 - item.selectedPrint)
        } else {
            size = product.size
        }

        // calculate the unit price with the additional framing cost
        let additionalFramingCost = 0
        if (item.selectedFraming !== "None" && item.selectedFraming !== "Not Available") { // a framing option would have been selected
            additionalFramingCost = product.framingPrice[item.selectedPrint] // find the price of framing for the print size chosen
        }

        const unitPrice = product.price[item.selectedPrint] + additionalFramingCost

        data = {
            title: artwork.title,
            imagePath: artwork.imagePath,
            size,
            selectedPrint: item.selectedPrint,
            selectedFraming: item.selectedFraming,
            unitPrice,
            quantity: item.quantity,
            productType: product.productType
        }

        basket.push(data)
        totalPrice = Math.round((totalPrice + (unitPrice * item.quantity)) * 100) / 100
    }

    res.render('basket', { basket: basket, totalPrice: totalPrice })
})

router.post('/add', async (req, res) => { // adding to basket from the shop
    const product = await Product.findById(req.body.productId)

    // product choices from the user
    const selectedPrint = req.body.printChoice
    let selectedFraming = "Not Available"

    if ( product.framingPrice.length > 0 ) {
        selectedFraming = req.body.framingChoice
    }

    // formatting the above gathered information into one json object to be added into the user's session basket
    basketItem = {
        productId: product.id,
        productType: product.productType,
        selectedPrint,
        selectedFraming
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

router.post('/reduce-quantity', (req, res) => { // for reducing quantity / deleting from basket
    const itemIndex = req.body.itemIndex
    let basket = new Basket(req.session.basket.items)
    basket.reduceQuantity(itemIndex)
    req.session.basket = basket
    req.session.save(err => {
        if (err) {
            console.log(err)
        }
    })

    res.redirect('/')
})

router.post('/increase-quantity', (req, res) => {
    const itemIndex = req.body.itemIndex
    let basket = new Basket(req.session.basket.items)
    basket.increaseQuantity(itemIndex)
    req.session.basket = basket
    req.session.save(err => {
        if (err) {
            console.log(err)
        }
    })
    
    res.redirect('/')
})

router.post('/checkout', async (req, res) => { // checking out the user's session basket
    const basketItems = req.session.basket.items

    // create an array of json objects with relevant data for each item in the stripe checkout
    basket = []
    for (let item in basketItems) {
        const product = await Product.findById(basketItems[item].productId)
        const artwork = await Artwork.findById(product.artwork)
        
        let size
        if (product.productType === "Print") {
            size = "A" + (5 - basketItems[item].selectedPrint)
        } else {
            size = product.size
        }

        let additionalFramingCost = 0
        if (basketItems[item].selectedFraming !== "None" && basketItems[item].selectedFraming !== "Not Available") { // a framing option would have been selected
            additionalFramingCost = product.framingPrice[basketItems[item].selectedPrint] // find the price of framing for the print size chosen
        }

        const unitPrice = product.price[basketItems[item].selectedPrint] + additionalFramingCost

        data = {
            title: artwork.title + " (" + product.productType + ")",
            imagePath: artwork.imagePath,
            unitPrice: unitPrice * 100, // stripe uses it as pennies/cents
            size,
            selectedFraming: basketItems[item].selectedFraming,
            quantity: basketItems[item].quantity
        }

        basket.push(data)
    }

    try { // attempt to create a stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB']
            },
            mode: 'payment',
            line_items: basket.map(item => {
                return {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: item.title
                        },
                        unit_amount: item.unitPrice

                    },
                    quantity: item.quantity,
                    description: "Size: " + item.size + ", Framing: " + item.selectedFraming,
                }
            }), // change this to a non foreach loop because it is not async
            success_url: `${process.env.SERVER_URL}/basket/checkout/success`,
            cancel_url: `${process.env.SERVER_URL}/basket`
        })

        res.json({ url: session.url })
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/checkout/success', (req, res) => {
    res.render('basket/success')
})

module.exports = router