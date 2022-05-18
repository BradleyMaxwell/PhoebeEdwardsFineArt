//IMPORTANT STUFF
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

//MODELS
const User = require('../models/user')

//ROUTERS

//LOGIN
router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.login(email, password)
        
        const token = createToken(user._id)
        
        if (user.role === "admin") {
            res.cookie('adminJwt', token, { httpOnly: true, maxAge: maxAge * 1000 }) // (name of cookie, value of cookie, extra attributes)
        } else {
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }) // (name of cookie, value of cookie, extra attributes)
        }
        res.redirect('/')
    }
    catch (err) {
        res.send(err)
    }
})

//SIGNUP
router.get('/signup', (req, res) => {
    res.render('user/signup', {errorMessage: ''})
})

router.post('/signup', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        })

        await user.save()
        const token = createToken(user._id)
        
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }) // (name of cookie, value of cookie, extra attributes)
        res.redirect('/')
    }
    catch (err) {
        const errorMessage = err.message
        console.log(errorMessage)
        res.render('user/signup', {errorMessage: errorMessage})
    }
})

//LOGOUT
router.get('/logout', (req, res) => {
    const adminToken = req.cookies.adminJwt
    if (adminToken) {
        res.cookie('adminJwt', '', {maxAge: 1})
    } else {
        res.cookie('jwt', '', {maxAge: 1})
    }
    res.redirect('/')
})

const maxAge = 60 * 60 * 2 // lifespan in seconds
function createToken (id) {
    return jwt.sign( { id }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: maxAge
    })
}

module.exports = router