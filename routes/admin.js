// ADMIN HUB

const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml'] // what type of images will be used in the website

//MODELS
const Gallery = require('../models/gallery')
const User = require('../models/user')
const Artwork = require('../models/artwork')
const Product = require('../models/product')

//INDEX

router.get('/', (req, res) => {
    res.render('admin')
})

//GALLERY

router.get('/gallery', async (req, res) => { // show all galleries
    try {
        const galleries = await Gallery.find({})
        const artworks = await Artwork.find({})
        res.render('admin/gallery', {galleries: galleries, artworks: artworks})
    }
    catch {
        res.send('Cannot load gallery database')
    }
})

router.get('/gallery/new', async (req, res) => { // add new gallery
    const artworks = await Artwork.find({}) // so there is a select option input for what the preview image is
    res.render('admin/gallery/new', {gallery: new Gallery(), artworks: artworks})
})

router.post('/gallery', async (req, res) => { // logic for adding a new gallery
    const gallery = new Gallery({
        name: req.body.name
    })
    try {
        const newGallery = await gallery.save()
    
        res.redirect('gallery')
    }
    catch {
        res.send('Something went wrong')
    }
})

router.get('/gallery/:id', async (req, res) => { // view the gallery
    try {
        const gallery = await Gallery.findById(req.params.id)
        res.render('admin/gallery/show', {gallery: gallery})
    }
    catch {
        res.redirect('/admin/gallery')
    }
})

router.get('/gallery/:id/edit', async (req, res) => { // go to page to edit an existing gallery
    try {
        const gallery = await Gallery.findById(req.params.id)
        const artworks = await Artwork.find({ gallery: req.params.id })
        res.render('admin/gallery/edit', {gallery: gallery, artworks: artworks})
    }
    catch {
        res.redirect('/admin/gallery')
    }
})

router.put('/gallery/:id', async (req, res) => { // logic that finds the gallery and updates its values
    let gallery
    try {
        gallery = await Gallery.findById(req.params.id)
        gallery.name = req.body.name
        gallery.previewArtwork = req.body.previewArtwork
        await gallery.save()

        let previewArtwork = await Artwork.findById(req.body.previewArtwork) // doing this to make the load smaller on the front end side
        previewArtwork.isPreview = true
        await previewArtwork.save()

        res.redirect('/admin/gallery')
    }
    catch {
        if (gallery == null) {
            res.redirect('/admin/gallery')
        }
        else {
            res.send('Error Updating Gallery')
        }
    }
})

router.delete('/gallery/:id', async (req, res) => { // logic for deleting a gallery
    let gallery
    try {
        gallery = await Gallery.findById(req.params.id)
        await gallery.remove()
        res.redirect('/admin/gallery')
    }
    catch {
        if (gallery == null) {
            res.redirect('/admin/gallery')
        }
        else {
            res.send('Error Deleting Gallery. Check if the gallery has any artwork linked to it.')
        }
    }
})

//USERS

router.get('/users', async (req, res) => { // displays all users
    try {
        const users = await User.find({})
        res.render('admin/users', {users: users})
    }
    catch {
        res.redirect('users')
    }
})

router.post('/users', async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            role: req.body.role
        })

        await newUser.save()
        res.redirect('users')
    }
    catch (err) {
        res.send(err)
    }
})

router.get('/users/new', (req, res) => { // displays the page for creating new users
    res.render('admin/users/new', {user: new User()})
})

router.delete('/users/:id', async (req, res) => { // logic for deleting a user
    let user
    try {
        user = await User.findById(req.params.id)
        await user.remove()

        res.redirect('/admin/users')
    }
    catch (err) {
        res.send(err)
    }
})

//ARTWORKS

router.get('/artwork', async (req, res) => { // page that shows all artwork
    try {
        const artworks = await Artwork.find({}).sort({ title: 'asc' })
        res.render('admin/artwork', {artworks: artworks})
    }
    catch {
        res.send('Something went wrong')
    }
})

router.get('/artwork/new', async (req, res) => { // page for adding new artwork
    try {
        const galleries = await Gallery.find({})
        res.render('admin/artwork/new', { artwork: new Artwork(), galleries: galleries})
    }
    catch {
        res.redirect('/')
    }
})

router.post('/artwork', async (req, res) => { // logic for adding artwork to the database
    const artwork = new Artwork({
        title: req.body.title,
        context: req.body.context,
        gallery: req.body.gallery,
        showInGallery: req.body.showInGallery
    })
    saveImage(artwork, req.body.image) // runs the uploaded image to check the image details to make sure its correct to save

    try {
        const newArtwork = await artwork.save()
        res.redirect('artwork')
    }
    catch (err) {
        res.send(err)
    }
})

router.put('/artwork/:id', async (req, res) => { // logic that finds the artwork and updates its values
    let artwork
    try {
        artwork = await Artwork.findById(req.params.id)
        artwork.title = req.body.title
        artwork.context = req.body.context
        artwork.gallery = req.body.gallery
        artwork.showInGallery = req.body.showInGallery
        if (req.body.image != null && req.body.image !== '') {
            saveImage(artwork, req.body.image)
        }

        await artwork.save()
        res.redirect(`/admin/artwork`)
    }
    catch {
        if (req.body.gallery == null) {
            res.redirect('/admin/artwork')
        }
        else {
            res.send('Error Updating Artwork')
        }
    }
})

router.delete('/artwork/:id', async (req, res) => { // logic for deleting an artwork
    let artwork
    try {
        artwork = await Artwork.findById(req.params.id)
        await artwork.remove()
        res.redirect('/admin/artwork')
    }
    catch {
       res.send('Error deleting artwork')
    }
})

router.get('/artwork/:id/edit', async (req, res) => { // go to page to edit an existing artwork
    try {
        const artwork = await Artwork.findById(req.params.id)
        const galleries = await Gallery.find({})
        res.render('admin/artwork/edit', {artwork: artwork, galleries: galleries})
    }
    catch {
        res.redirect('/admin/artwork')
    }
})

//SHOP

router.get('/shop', async (req, res) => { // show all the shop products
    const products = await Product.find({})
    const artworks = await Artwork.find({})
    res.render('admin/shop', { products: products, artworks: artworks })
})

router.get('/shop/new', async (req, res) => { // go to page that creates new shop products
    const artworks = await Artwork.find({})
    res.render('admin/shop/new', {artworks: artworks, product: new Product()})
})

router.post('/shop', async (req, res) => { // logic behind creating and sending new shop product to the database
    let productPrice
    let productFramingPrice = []

    if (req.body.productType === "Print") {
        productPrice = [req.body.A5price, req.body.A4price, req.body.A3price, req.body.A2price, req.body.A1price]
        if (req.body.framingOptionChoice === "Yes") {
            productFramingPrice = [req.body.A5framingprice, req.body.A4framingprice, req.body.A3framingprice, req.body.A2framingprice, req.body.A1framingprice]
        }
    }
    else { // if it is not print then it is an original
        productPrice = [req.body.price]
        if (req.body.framingOptionChoice === "Yes") {
            productFramingPrice = [req.body.framingpriceOriginal]
        }
    }


    const product = new Product({
        artwork: req.body.artwork,
        productType: req.body.productType,
        price: productPrice,
        mediums: req.body.mediums,
        size: req.body.size,
        framingPrice: productFramingPrice
    })

    try {
        const newProduct = await product.save()
        res.redirect('shop')
    }
    catch {
        res.send('Something went wrong')
    }
})

router.put('/shop/:id', async (req, res) => { // logic that updates an existing shop product
    let product
    try {
        product = await Product.findById(req.params.id)
        let productPrice
        let productFramingPrice = []

        if (product.productType === "Print") {
            productPrice = [req.body.A5price, req.body.A4price, req.body.A3price, req.body.A2price, req.body.A1price]
            if (req.body.framingOptionChoice === "Yes") {
                productFramingPrice = [req.body.A5framingprice, req.body.A4framingprice, req.body.A3framingprice, req.body.A2framingprice, req.body.A1framingprice]
            }
        }
        else { // if it is not print then it is an original
            productPrice = [req.body.price]
            if (req.body.framingOptionChoice === "Yes") {
                productFramingPrice = [req.body.framingpriceOriginal]
            }
        }

        product.price = productPrice
        product.mediums = req.body.mediums
        product.size = req.body.size
        product.framingPrice = productFramingPrice

        await product.save()
        res.redirect('/admin/shop')
    }
    catch {
        res.send('Error Updating Shop Product')
    }
})

router.delete('/shop/:id', async (req, res) => { // logic for deleting a shop product
    let product
    try {
        product = await Product.findById(req.params.id)
        await product.remove()

        res.redirect('/admin/shop')
    }
    catch {
        res.send('Error deleting shop item')
    }
})

router.get('/shop/:id/edit', async (req, res) => { // go to page to edit an existing shop product
    try {
        const product = await Product.findById(req.params.id)
        const artwork = await Artwork.findById(product.artwork)
        res.render('admin/shop/edit', {product: product, artwork: artwork})
    }
    catch {
        res.redirect('/admin/shop')
    }
})

// Helper Functions

function saveImage(artwork, imageEncoded) {
    if (imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) { // checks if it is valid and a specified mime type before saving
        artwork.image = new Buffer.from(image.data, 'base64')
        artwork.imageType = image.type
    }
}


module.exports = router