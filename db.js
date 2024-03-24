const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()
connect()

async function connect() {
    var con = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.DBUSERNAME,
        password: process.env.PASSWORD,
        database: "comp4960project"
    })
    module.exports = con
    const app = require('./app')
    app.listen(process.env.PORT)
}