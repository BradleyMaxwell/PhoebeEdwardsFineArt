const express = require('express')
const router = express.Router()
const Gallery = require('../models/gallery')
const Artwork = require('../models/artwork')

router.get('/', async (req, res) => {
    try {
        const galleries = []
        
        const foundGalleries = await Gallery.find({})
        for (let current = 0; current < foundGalleries.length; current++) {
            const currentGallery = foundGalleries[current]
            const currentPreviewArtwork = await Artwork.findById(currentGallery.previewArtwork)

            const data = [currentGallery, currentPreviewArtwork]
            galleries.push(data)
        }

        res.render('index', { galleries: galleries })
    }
    catch {
        res.redirect('/')
    }
})


module.exports = router