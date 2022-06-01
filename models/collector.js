const mongoose = require('mongoose')
const { isEmail } = require('validator')

const collectorSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please enter an email.'],
        validate: [isEmail, "Please enter a valid email."]
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }

})

module.exports = mongoose.model('Collector',collectorSchema)