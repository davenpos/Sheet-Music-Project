const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const scoreController = require('./controllers/scoreController')

router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/create-score', userController.mustBeLoggedIn, scoreController.createScreen)
router.post('/create-score', userController.mustBeLoggedIn, scoreController.createScore)
router.get('/score/:id', scoreController.viewScore)
router.post('/save', userController.mustBeLoggedIn, scoreController.saveScore)
router.post('/delete', userController.mustBeLoggedIn, scoreController.deleteScore)

module.exports = router