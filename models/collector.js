const mongoose = require('mongoose')

const collectorSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    }
})