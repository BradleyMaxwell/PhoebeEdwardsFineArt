const mongoose = require('mongoose')
const Artwork = require('./artwork')

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    previewArtwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork'
    }
})

gallerySchema.pre('remove', function(next) { // prevents gallery from being deleted if there is artwork linked to it
    Artwork.find({ gallery: this.id }, (err, artworks) => {
      if (err) {
        next(err)
      } else if (artworks.length > 0) {
        next(new Error('This gallery cannot be deleted because there is still artwork linked to it'))
      } else {
        next()
      }
  })
})

module.exports = mongoose.model('Gallery', gallerySchema)
