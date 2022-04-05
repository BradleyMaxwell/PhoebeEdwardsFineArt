if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// RETRIEVE IMPORTANT STUFF

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// SETTING UP APP

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
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

app.use('/', indexRouter)
app.use('/biography', biographyRouter)
app.use('/gallery', galleryRouter)
app.use('/shop', shopRouter)
app.use('/contact', contactRouter)

app.listen(process.env.PORT || 3000)