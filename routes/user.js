const express = require('express')
const router = express.Router()

router.get('/profile', (req, res) => {
    // const { nombre, imagen } = req.user
    // res.render('user/profile', {
    //     user: {
    //         nombre,
    //         imagen
    //     }
    // })
    res.send('recibido')
})
router.get('/close-sesion', (req, res) => {
    delete req.session.auth_token
    res.redirect('/')
})

module.exports = router