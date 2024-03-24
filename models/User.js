const validator = require("validator")
const bcrypt = require("bcryptjs")
const db = require('../db')

let User = function(data) {
    this.data = data
    this.errors = []
    this.id
}

User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate()
    
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            var [rows, fields] = await db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [this.data.username, this.data.email, this.data.password])
            this.id = rows[0].id
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

User.prototype.cleanUp = function() {
    if (typeof(this.data.username) != "string") {
        this.data.username = ""
    }
    if (typeof(this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof(this.data.password) != "string") {
        this.data.password = ""
    }

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.username == "") {
            this.errors.push("You must provide a username.")
        }
        if (this.data.email == "") {
            this.errors.push("You must provide an email.")
        }
        if (this.data.password == "") {
            this.errors.push("You must provide a password.")
        }
        if (this.data.password.length > 0 && this.data.password.length < 12) {
            this.errors.push("Password must be at least 12 characters long")
        }
        if (this.data.password.length > 50) {
            this.errors.push("Password cannot exceed 50 characters")
        }
        if (this.data.username.length > 0 && this.data.username.length < 3) {
            this.errors.push("Username must be at least 3 characters long")
        }
        if (this.data.username.length > 30) {
            this.errors.push("Username cannot exceed 30 characters")
        }
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("Please enter a valid email address")
        }
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
            this.errors.push("Username can only contain letters and numbers")
        }
    
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            var [rows, fields] = await db.execute('SELECT * FROM users WHERE username = ?', [this.data.username])
            if (rows.length) {
                this.errors.push("Username already taken")
            }
        }

        if (validator.isEmail(this.data.email)) {
            var [rows, fields] = await db.execute('SELECT * FROM users WHERE email = ?', [this.data.email])
            if (rows.length) {
                this.errors.push("Email already taken")
            }
        }
        resolve()
    })
}

User.prototype.login = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        var [rows, fields] = await db.execute('SELECT * FROM users WHERE username = ? AND email = ?', [this.data.username, this.data.email])
        if (rows.length && bcrypt.compareSync(this.data.password, rows[0].password)) {
            this.id = rows[0].id
            resolve()
        } else {
            reject("Invalid username/password")
        }
    })
}

module.exports = User