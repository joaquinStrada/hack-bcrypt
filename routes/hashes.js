const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('hashes/index')
})
router.get('/add', (req, res) => {
    res.send('recibido!!!')
})

module.exports = router