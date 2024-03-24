const Score = require('../models/Score')

exports.createScreen = function(req, res) {
    let errors = req.session.errors || []
    delete req.session.errors
    res.render('create-score', {errors})
}

exports.createScore = function(req, res) {
    let score = new Score(req.body, req.session.user)
    score.createScore().then(function(id) {
        res.redirect(`/score/${id}`)
    }).catch(function(e) {
        req.session.errors = []
        req.session.errors = e.slice()
        req.session.save(function() {
            res.redirect('/create-score')
        })
    })
}

exports.viewScore = async function(req, res) {
    let username = (req.session.user) ? req.session.user.username : 'Not_Logged_In'
    try {
        let score = await Score.findScoreByID(req.params.id)
        let sessionUserID = (req.session.user) ? req.session.user.id : 0
        if (score.publicOrPrivate == 'private' && sessionUserID != score.userID) {
            res.render('private-score', {username: username})
        } else {
            res.render('score-page', {
                score: score,
                username: username,
                userID: sessionUserID
            })
        }
    } catch {
        res.render('404', {username: username})
    }
}

exports.saveScore = function(req, res) {
    Score.saveScore(req.body.column, req.body.value, req.body.scoreID).then(message => {
        res.send(message)
    }).catch(error => {
        res.send(error)
    })
}

exports.deleteScore = function(req, res) {
    Score.deleteScore(req.body.scoreID).then(() => {
        req.session.save(() => {
            res.redirect('/') //Not rendering home-dashboard template
        })
    }).catch(() => {
        res.send("Unable to delete score")
    })
}