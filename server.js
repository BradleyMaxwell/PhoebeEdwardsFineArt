if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// RETRIEVE IMPORTANT STUFF
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./public/scripts/jwtAuthenticator')

// SETTING UP APP
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) // for using data from body easily with the database
app.use(methodOverride('_method')) // used for put and delete post methods
app.use(cookieParser()) // for working with cookies

//DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => {
    console.error(error)
})
db.once('open', () => console.log('Connected to Mongoose'))

// ROUTES SETUP
const indexRouter = require('./routes/index')
const biographyRouter = require('./routes/biography')
const galleryRouter = require('./routes/gallery')
const shopRouter = require('./routes/shop')
const contactRouter = require('./routes/contact')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user');
const { json } = require('body-parser');

app.use('/', indexRouter)
app.use('/biography', biographyRouter)
app.use('/gallery', galleryRouter)
app.use('/shop', shopRouter)
app.use('/contact', contactRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)

//WHERE TO LISTEN FOR REQUESTS
app.listen(process.env.PORT || 3000)