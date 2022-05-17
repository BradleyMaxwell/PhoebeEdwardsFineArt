const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.adminJwt
    if (token) { // if there is an admin token present
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
            if (err) { // means token is not valid
                console.log(err.message)
                res.redirect('/user/login')
            }
            else {
                console.log(decodedToken)
                console.log('You are authenticated to use this route')
                next()
            }
        })
    }
    else {
        res.redirect('/user/login')
    }
}

module.exports = { requireAuth }