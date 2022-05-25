if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// RETRIEVE IMPORTANT STUFF
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Basket } = require('./models/basket');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./public/scripts/jwtAuthenticator');

// SETTING UP APP
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) // for using data from body easily with the database
app.use(methodOverride('_method')) // used for put and delete post methods
app.use(cookieParser()) // for working with cookies
app.use(express.json());

//DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', error => {
    console.error(error)
})
db.once('open', () => console.log('Connected to Mongoose'))

app.use(session({ // configure the basket session to be stored on the mongodb database
    name: 'user.session',
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ // store the session in a location using the mongoose connection established
        mongoUrl: process.env.DATABASE_URL,
        dbName: 'phoebeedwardsfineart',
        collectionName: 'sessions',
        ttl: 4 * 60 * 60, // 4 hours
    })
}))

app.use((req, res, next) => { // middleware to allow the session to be accessed by all of the views of our website
    res.locals.session = req.session
    next()
})

// ROUTES SETUP
const indexRouter = require('./routes/index')
const biographyRouter = require('./routes/biography')
const galleryRouter = require('./routes/gallery')
const shopRouter = require('./routes/shop')
const contactRouter = require('./routes/contact')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user');
const basketRouter = require('./routes/basket')
const { json } = require('body-parser');

app.get('*', checkUser, (req, res, next) => {
    if (!req.session.basket) { // every request on the website will check if the session has a basket already
        req.session.basket = new Basket([])
    }
    next()
})
app.use('/', indexRouter)
app.use('/biography', biographyRouter)
app.use('/gallery', galleryRouter)
app.use('/shop', shopRouter)
app.use('/contact', contactRouter)
app.use('/admin', requireAuth, adminRouter)
app.use('/user', userRouter)
app.use('/basket', basketRouter)

//WHERE TO LISTEN FOR REQUESTS
app.listen(process.env.PORT || 3000)