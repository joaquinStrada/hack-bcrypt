const mongoose = require('mongoose')

const hashSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        min: 4,
        max: 40
    },
    descripcion: {
        type: String,
        required: true,
        min: 4,
        max: 200
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20
    },
    salt: {
        type: Number,
        required: true,
        min: 1,
        max: 999
    },
    hash: {
        type: String,
        required: true,
        minlength: 8
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Hash', hashSchema);