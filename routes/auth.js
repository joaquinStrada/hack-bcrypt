const express = require('express')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')

const schemaRegister = Joi.object({
    nombre: Joi.string().min(4).max(40).required(),
    email: Joi.string().min(6).max(1024).required().email(),
    password: Joi.string().min(8).max(20).required()
})
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(20).required()
})

const validatelogger = (req, res, next) => {
    
    // obtenemos el token
    const token = req.session.auth_token
    if (!token) {
        next()
    }

    // validamos el token
    try {
        const validate = jwt.verify(token, process.env.TOKEN_SECRET)
        res.redirect('/hashes')
    } catch (err) {
        next()
    }
}

router.get('/', validatelogger, (req, res) => {
    res.render('auth/login')
})
router.post('/', async (req, res) => {
    const { body } = req
    
    // validamos que nos hayan enviado todos los campos
    const { error } = schemaLogin.validate(body)
    if (error) {
        return res.json({
            error: true,
            mensaje: error.details[0].message
        })
    }

    try {

        // validar el usuario
        const user = await User.findOne({
            email: body.email
        })
        if (!user) {
            return res.json({
                error: true,
                mensaje: 'Usuario y/o Contraseña incorrectos'
            })
        }

        // validamos la contraseña
        const validPassword = await bcrypt.compare(body.password, user.password)
        if (!validPassword) {
            return res.json({
                error: true,
                mensaje: 'Usuario y/o Contraseña incorrectos'
            })
        }

        // creamos el token
        const token = jwt.sign({
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            imagen: user.imagen
        }, process.env.TOKEN_SECRET)

        req.session.auth_token = token

        res.header('auth-token', token).json({
            error: false,
            token
        })
    } catch (err) {
        res.json({
            error: null,
            mensaje: err
        })
    }
})
router.get('/register', (req, res) => {
    res.render('auth/register')
})
router.post('/register', async (req, res) => {
    const { body } = req

    // validamos que nos hayan enviado todos los campos
    const { error } = schemaRegister.validate({
        nombre: body.nombre,
        email: body.email,
        password: body.password
    })
    if (error) {
        return res.json({
            error: true,
            mensaje: error.details[0].message
        })
    }

    try {

       // validamos que el email no exista
       const isEmailExist = await User.findOne({
           email: body.email
       })
       if (isEmailExist) {
           return res.json({
               error: true,
               mensaje: 'El email ya esta registrado'
           })
       }

       // registramos al usuario
       const salt = await bcrypt.genSalt(10)
       const password = await bcrypt.hash(body.password, salt)
       
       const user = new User({
            nombre: body.nombre,
            email: body.email,
            password: password,
            imagen: body.imagen
       })
       await user.save()

       res.json({
           error: false,
           mensaje: 'Usuario registrado satisfactoriamente'
       })
    } catch (err) {
        res.json({
            error: null,
            mensaje: err
        })
    }

})

module.exports = router