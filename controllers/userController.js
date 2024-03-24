const User = require('../models/User')
const Score = require('../models/Score')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(() => {
        req.session.user = {
            username: user.data.username,
            id: user.id
        }
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(e => {
        req.session.errors = [e]
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/')
    })
}

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {
            username: user.data.username,
            id: user.id
        }
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(() => {
        req.session.errors = []
        req.session.errors = user.errors.slice()
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.home = function(req, res) {
    if (req.session.user) {
        Score.getUserScores(req.session.user.id).then(function(scores) {
            res.render('home-dashboard', {
                username: req.session.user.username,
                scores: scores
            })
        }).catch(function() {
            res.render("404")
        })
    } else {
        res.render('home-guest', {errors: req.session.errors})
        req.session.destroy()
    }
}

exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.session.save(function() {
            res.redirect('/')
        })
    }
}