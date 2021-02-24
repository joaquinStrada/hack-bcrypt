const express = require('express')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const router = express.Router()
const HashDB = require('../models/Hash')

/**
 * validaciones de campos
 */
const schemaAdd = Joi.object({
    nombre: Joi.string().min(4).max(40).required(),
    descripcion: Joi.string().min(4).max(200).required(),
    password: Joi.string().min(8).max(20).required(),
    salt: Joi.number().min(1).max(999).required()
})

router.get('/', async (req, res) => {
    const { nombre, imagen } = req.user
    const arrayHashes = await HashDB.find({
        id_user: req.user.id
    })
    console.log(arrayHashes);
    res.render('hashes/index', {
        user: {
            nombre,
            imagen
        },
        arrayHashes
    })
})
router.get('/add', (req, res) => {
    const { nombre, imagen } = req.user
    res.render('hashes/add', {
        user: {
            nombre,
            imagen
        }
    })
})
router.post('/add', async (req, res) => {
    const { nombre, descripcion, password, salt } = req.body

    // validamos que nos hayan enviado todos los campos
    const { error } = schemaAdd.validate(req.body)
    if (error) {
        return res.json({
            error: true,
            mensaje: error.details[0].message
        })
    }

    try {
        // generamos el hash
        const saltInt = parseInt(salt)
        const saltHash = await bcrypt.genSalt(saltInt)
        const hash = await bcrypt.hash(password, saltHash)

        //guardamos el hash
        const Hashsaved = new HashDB({
            nombre,
            descripcion,
            password,
            salt: saltInt,
            hash,
            id_user: req.user.id
        })
        await Hashsaved.save()

        res.json({
            error: false,
            mensaje: 'hash creado satisfactoriamente'
        })
        
    } catch (err) {
        console.log(err);
        res.json({
            error: true,
            mensaje: err
        })
    }
})

module.exports = router