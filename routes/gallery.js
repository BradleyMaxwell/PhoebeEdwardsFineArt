const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('gallery/index')
})

router.get('/equine', (req, res) => {
    res.render('gallery/equine')
})

router.get('/digital', (req, res) => {
    res.render('gallery/digital')
})

router.get('/landscapes', (req, res) => {
    res.render('gallery/landscapes')
})

router.get('/photography', (req, res) => {
    res.render('gallery/photography')
})

router.get('/portraits', (req, res) => {
    res.render('gallery/portraits')
})

router.get('/university', (req, res) => {
    res.render('gallery/university')
})







module.exports = router