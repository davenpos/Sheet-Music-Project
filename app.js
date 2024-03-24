const express = require('express')
const session = require('express-session')
const MySQLStore = require('connect-mysql')(session)
const app = express()
const router = require('./router')

options = {
    config: {
        user: process.env.DBUSERNAME,
        password: process.env.PASSWORD,
        database: "comp4960project"
    }
}

let sessionOptions = session({
    secret: "This is my secret property that nobody knows (except me of course)",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        httpOnly: true
    },
    store: new MySQLStore(options)
})

app.use(sessionOptions)
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use('/', router)

module.exports = app