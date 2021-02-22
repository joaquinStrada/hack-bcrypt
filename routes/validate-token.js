const jwt = require('jsonwebtoken')

// middleware to validate token (rutas protegidas)
const validateToken = (req, res, next) => {
    
    // obtenemos el token
    const token = req.session.auth_token
    if (!token) {
        return res.redirect('/')
    }

    // validamos el token
    try {
        const validate = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = validate
        next()
    } catch (err) {
        res.redirect('/')
    }
}

module.exports = validateToken