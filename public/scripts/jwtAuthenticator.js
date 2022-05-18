const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const requireAuth = (req, res, next) => {
    const token = req.cookies.adminJwt
    if (token) { // if there is an admin token present
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
            if (err) { // means token is not valid
                res.redirect('/user/login')
            }
            else {
                next()
            }
        })
    }
    else {
        res.redirect('/user/login')
    }
}

const checkUser = (req, res, next) => {
    let token

    let isAdmin
    if (req.cookies.adminJwt) {
        token = req.cookies.adminJwt
        isAdmin = true
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
        isAdmin = false
    }

    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                res.locals.adminUser = null
                next()
            } else {
                let user = await User.findById(decodedToken.id)
                if ( isAdmin ) {
                    res.locals.adminUser = user
                    res.locals.user = null
                } else {
                    res.locals.user = user
                    res.locals.adminUser = null
                }
                next()
            }
        })
    } else {
        res.locals.user = null
        res.locals.adminUser = null
        next()
    }
}

module.exports = { requireAuth, checkUser }