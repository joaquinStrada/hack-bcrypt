require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express()
const port = process.env.PORT || 3000;

// capturar body
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json({
    limit: 200000000
}))

// Motor de plantilla
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


// Conexión a Base de datos
const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@clustercurso.rvyvo.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

// inicio las variables de session
const mongoStore = new MongoDBStore({
    uri: url,
    collection: 'sessions'
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore
}))

// import routes
const auth = require('./routes/auth')
const validateToken = require('./routes/validate-token')
const hashes = require('./routes/hashes')
const user = require('./routes/user')

// routes middlewares
app.use('/', auth);
app.use('/hashes', validateToken, hashes)
app.use('/user', validateToken, user)

// archivos staticos
app.use(express.static(__dirname + "/public"))

// inciamos el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto: ${port}`);
})