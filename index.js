const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// Modules Export
const Tought = require('./models/Tought')
const User = require('./models/User')

// Import Routes
const ToughtsRoutes = require('./routes/ToughtsRoutes')
const AuthRoutes = require('./routes/AuthRoutes')

// Import controllers
const ToughtController = require('./controllers/ToughtController')

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(session({
    name: 'session', // nome
    secret: 'nosso_secret', // inquebravel
    resave: false, // caiu sessão, desconecta
    saveUninitialized: false,
    store: new FileStore({ // salva sessão em arquivo
        logFn: function(){},
        path: require('path').join(require('os').tmpdir(), 'sessions'), // caminho para salvar a session
    }),
    cookie: {
        secure: false,
        maxAge: 360000, // tempo de duração
        expires: new Date(Date.now() + 360000), // força a expiração, expira em 24h
        httpOnly: true
    }
}))

// Flash messages
app.use(flash())
app.use(express.static("public"))

// set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

// Routes
app.use('/toughts', ToughtsRoutes)
app.use('/', AuthRoutes)

app.get('/', ToughtController.showToughts)

// app.engine("handlebars", exphbs.engine())
// app.set("view engine", "handlebars")
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

conn.sync().then(() => {
    app.listen(3000)
}).catch((err) => console.log(err))