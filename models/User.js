const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    nombre: {
        type: String,
        required: true,
        min: 4,
        max: 40
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    imagen: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema);