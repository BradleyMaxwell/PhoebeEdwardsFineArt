const mongoose = require('mongoose')
const { isEmail } = require('validator')
const { isAlpha } = require('validator')
const bcrypt = require('bcrypt')
const { use } = require('../routes')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email.']
    },
    firstname: {
        type: String,
        required: true,
        validator: [isAlpha, 'Please enter a first name that is only letters.']
    },
    lastname: {
        type: String,
        required: true,
        validator: [isAlpha, 'Please enter a last name that is only letters.']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long.']
    },
    role: {
        type: String,
    }
})

userSchema.pre('save', async function (next) { // encrypts the password before saving. Swiper no swiping!
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email })
    if (user) { 
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

module.exports = mongoose.model('User', userSchema)