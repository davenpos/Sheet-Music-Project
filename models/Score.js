const db = require('../db')
const randomstring = require('randomstring')
const validator = require("validator")

let Score = function(data, user) {
    this.data = data
    this.user = user
    this.errors = []
    this.notesPerBar
    this.scoreID
}

Score.prototype.createScore = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            let idUsed = true
            while (idUsed) {
                this.scoreID = randomstring.generate()
                var [scoreRows, scoreFields] = await db.execute("SELECT * FROM scores WHERE id = ?", [this.scoreID])
                if (!scoreRows.length) {
                    idUsed = false
                }
            }
            
            let scoreString = ''
            scoreString += 'bpm' + this.data.bpm + ' '

            if ((this.data.key == 'C' && this.data.majorMinor == 'Major') || (this.data.key == 'A' && this.data.majorMinor == 'Minor')) {
                scoreString += '0'
            } else if ((this.data.key == 'F' && this.data.majorMinor == 'Major') || (this.data.key == 'D' && this.data.majorMinor == 'Minor')) {
                scoreString += '1b'
            } else if ((this.data.key == 'B♭' && this.data.majorMinor == 'Major') || (this.data.key == 'G' && this.data.majorMinor == 'Minor')) {
                scoreString += '2b'
            } else if ((this.data.key == 'E♭' && this.data.majorMinor == 'Major') || (this.data.key == 'C' && this.data.majorMinor == 'Minor')) {
                scoreString += '3b'
            } else if ((this.data.key == 'A♭' && this.data.majorMinor == 'Major') || (this.data.key == 'F' && this.data.majorMinor == 'Minor')) {
                scoreString += '4b'
            } else if ((this.data.key == 'D♭' && this.data.majorMinor == 'Major') || (this.data.key == 'B♭' && this.data.majorMinor == 'Minor')) {
                scoreString += '5b'
            } else if ((this.data.key == 'G♭' && this.data.majorMinor == 'Major') || (this.data.key == 'E♭' && this.data.majorMinor == 'Minor')) {
                scoreString += '6b'
            } else if ((this.data.key == 'C♭' && this.data.majorMinor == 'Major') || (this.data.key == 'A♭' && this.data.majorMinor == 'Minor')) {
                scoreString += '7b'
            } else if ((this.data.key == 'G' && this.data.majorMinor == 'Major') || (this.data.key == 'E' && this.data.majorMinor == 'Minor')) {
                scoreString += '1#'
            } else if ((this.data.key == 'D' && this.data.majorMinor == 'Major') || (this.data.key == 'B' && this.data.majorMinor == 'Minor')) {
                scoreString += '2#'
            } else if ((this.data.key == 'A' && this.data.majorMinor == 'Major') || (this.data.key == 'F♯' && this.data.majorMinor == 'Minor')) {
                scoreString += '3#'
            } else if ((this.data.key == 'E' && this.data.majorMinor == 'Major') || (this.data.key == 'C♯' && this.data.majorMinor == 'Minor')) {
                scoreString += '4#'
            } else if ((this.data.key == 'B' && this.data.majorMinor == 'Major') || (this.data.key == 'G♯' && this.data.majorMinor == 'Minor')) {
                scoreString += '5#'
            } else if ((this.data.key == 'F' && this.data.majorMinor == 'Major') || (this.data.key == 'D♯' && this.data.majorMinor == 'Minor')) {
                scoreString += '6#'
            } else if ((this.data.key == 'C' && this.data.majorMinor == 'Major') || (this.data.key == 'A♯' && this.data.majorMinor == 'Minor')) {
                scoreString += '7#'
            }

            scoreString += ' time' + this.data.notesPerBar + '/' + this.data.notes + ' treble('
            scoreString += this.clefNotes()
            scoreString += ') bass('
            scoreString += this.clefNotes()
            scoreString += ')'

            if (this.data.subtitle == "") {
                this.data.subtitle = "by " + this.user.username
            }

            var [rows, fields] = await db.execute("INSERT INTO scores (id, scorestring, publicOrPrivate, userID, title, subtitle) VALUES (?, ?, ?, ?, ?, ?)", [this.scoreID, scoreString, this.data.publicOrPrivate, this.user.id, this.data.title, this.data.subtitle])
            resolve(this.scoreID)
        } else {
            reject(this.errors)
        }
    })
}

Score.prototype.validate = function() {
    if (this.data.title == "") {
        this.errors.push("You must provide a title for your score")
    }

    if (this.data.bpm == "") {
        this.errors.push("You must provide a number of beats per minute")
    }

    if (this.data.key == "") {
        this.errors.push("You must provide a key")
    }

    if (this.data.notesPerBar == "" && this.data.notes == "") {
        this.errors.push("You must provide a time signature")
    }

    if (this.data.publicOrPrivate != "public" && this.data.publicOrPrivate != "private") {
        this.errors.push("You must select either public or private")
    }

    if (this.data.title.length > 255) {
        this.errors.push("Title cannot be longer than 255 characters")
    }
    
    if (this.data.subtitle.length > 255) {
        this.errors.push("Subtitle cannot be longer than 255 characters")
    }

    let bpmInt = parseInt(this.data.bpm)
    if (Number.isNaN(bpmInt) || bpmInt < 30) {
        this.errors.push("Beats per minute must be an integer greater than or equal to 30")
    }

    let acceptedKeys = ['A', 'A♭', 'A♯', 'B', 'B♭', 'C', 'C♭', 'C#', 'D', 'D♭', 'D♯', 'E', 'E♭', 'F', 'F♯', 'G', 'G♭', 'G♯']
    if (!acceptedKeys.includes(this.data.key) || (this.data.key == 'A♯' && this.data.majorMinor == 'Major') || (this.data.key == 'C♭' && this.data.majorMinor == 'Minor') || (this.data.key == 'D♭' && this.data.majorMinor == 'Minor') || (this.data.key == 'D♯' && this.data.majorMinor == 'Major') || (this.data.key == 'G♭' && this.data.majorMinor == 'Minor') || (this.data.key == 'G♯' && this.data.majorMinor == 'Major') || (this.data.majorMinor != 'Major' && this.data.majorMinor != 'Minor')) {
        this.errors.push("That is not a valid key")
    }

    let acceptedNotes = ['2', '4', '8', '16', '32', '64', '128']
    this.notesPerBar = parseInt(this.data.notesPerBar)
    if (Number.isNaN(this.notesPerBar) || !acceptedNotes.includes(this.data.notes) || this.notesPerBar < 2) {
        this.errors.push("That is not a valid time signature")
    }

    if (this.notesPerBar > 12) {
        this.errors.push("Time signature cannot have more than 12 notes per bar")
    }
}

Score.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") {
        this.data.title = ""
    }
    if (typeof(this.data.subtitle) != "string") {
        this.data.subtitle = ""
    }
    if (typeof(this.data.bpm) != "string") {
        this.data.bpm = ""
    }
    if (typeof(this.data.key) != "string") {
        this.data.key = ""
    }
    if (typeof(this.data.majorMinor) != "string") {
        this.data.majorMinor = ""
    }
    if (typeof(this.data.notesPerBar) != "string") {
        this.data.notesPerBar = ""
    }
    if (typeof(this.data.notes) != "string") {
        this.data.notes = ""
    }
    if (typeof(this.data.publicOrPrivate) != "string") {
        this.data.publicOrPrivate = ""
    }

    this.data = {
        title: this.data.title,
        subtitle: this.data.subtitle,
        bpm: this.data.bpm,
        key: this.data.key,
        majorMinor: this.data.majorMinor,
        notesPerBar: this.data.notesPerBar,
        notes: this.data.notes,
        publicOrPrivate: this.data.publicOrPrivate
    }
}

Score.findScoreByID = function(id) {
    return new Promise(async function(resolve, reject) {
        if (typeof(id) != "string" || id.length != 32 || !validator.isAlphanumeric(id)) {
            reject()
            return
        }

        var [rows, fields] = await db.execute("SELECT * FROM scores WHERE id = ?", [id])
        if (rows.length) {
            resolve(rows[0])
        } else {
            reject()
        }
    })
}

Score.getUserScores = function(id) {
    return new Promise(async function(resolve, reject) {
        var [rows, fields] = await db.execute("SELECT id, title FROM scores WHERE userID = ?", [id])
        resolve(rows)
    })
}

Score.saveScore = function(column, value, scoreID) {
    return new Promise(async (resolve, reject) => {
        willResolve = false
        let message = ""
        if (typeof(value) == "string" && typeof(scoreID) == "string" && scoreID.length == 32 && validator.isAlphanumeric(scoreID)) {
            if (column == 'scorestring') {
                message = "Score successfully saved"
                willResolve = true
            } else {
                if (value.length <= 255) {
                    message = column + ' updated to "' + value + '"'
                    willResolve = true
                } else {
                    message = "Unable to update " + column
                }
            }
        } else {
            message = (column == 'scorestring') ? "Unable to save score" : "Unable to update " + column
        }

        if (willResolve) {
            var [rows, fields] = await db.execute("UPDATE scores SET " + column + " = ? WHERE id = ?", [value, scoreID])
            resolve(message)
        } else {
            reject(message)
        }
    })
}

Score.prototype.clefNotes = function() {
    let notes = ""
    for (let i = 1; i <= this.notesPerBar; i++) {
        notes += this.data.notes + 'r'
        if (i != this.notesPerBar) {
            notes += ' '
        }
    }
    return notes
}

Score.deleteScore = function(scoreID) {
    return new Promise(async (resolve, reject) => {
        if (typeof(scoreID) == "string" && scoreID.length == 32 && validator.isAlphanumeric(scoreID)) {
            var [rows, fields] = await db.execute("DELETE FROM scores WHERE id = ?", [scoreID])
            resolve()
        } else {
            reject()
        }
    })
}

module.exports = Score