const express = require('express')
const router = express.Router()
const Gallery = require('../models/gallery')
const Artwork = require('../models/artwork')
const Collector = require('../models/collector')

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

router.post('/collectors-circle', async (req, res) => {
    try {
        const newCollector = new Collector({
            email: req.body.email
        })

        await newCollector.save()
        res.json({message: "Welcome to the Collector's Circle!"})
    }
    catch (err) {
        let errorMessage

        if (err.code === 11000) {
            errorMessage = "That email is already a collector."
        }
        if (err.message.includes('Collector validation failed')) {
            Object.values(err.errors).forEach(({properties}) => {
                errorMessage = properties.message
            })
        }

        res.json({ message: errorMessage })
    }
})

module.exports = router