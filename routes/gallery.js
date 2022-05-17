const bodyParser = require('body-parser')
const express = require('express')
const Gallery = require('../models/gallery')
const Artwork = require('../models/artwork')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const galleries = [] // this will be the array that holds JSON objects with the gallery and the corresponding imagePath
        
        const foundGalleries = await Gallery.find({})
        for (let current = 0; current < foundGalleries.length; current++) { // go through all the galleries and find it's preview image
            const currentGallery = foundGalleries[current]
            const currentPreviewArtwork = await Artwork.findById(currentGallery.previewArtwork)

            const data = [currentGallery, currentPreviewArtwork]
            galleries.push(data)
        }

        res.render('gallery/index', { galleries: galleries })
    }
    catch {
        res.redirect('/')
    }
})

router.get('/:id', async (req, res) => { // get the gallery and display it
    try {
        const gallery = await Gallery.findById(req.params.id)
        const artworks = await Artwork.find({ gallery: req.params.id, showInGallery: true }) // show all artwork in the gallery that is desired to be shown

        res.render('gallery/show', {gallery: gallery, artworks: artworks})
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router