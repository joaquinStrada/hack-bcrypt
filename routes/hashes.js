const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const { nombre, imagen } = req.user
    res.render('hashes/index', {
        user: {
            nombre,
            imagen
        }
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

module.exports = router