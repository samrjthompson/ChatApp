const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn, validateUser } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/user')

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

router.route('/')
    .get(isLoggedIn, catchAsync(users.renderFriendsList))

router.route('/register')
    .get(catchAsync(users.renderRegister))
    .post(isLoggedIn, catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)

router.route('/logout')
    .get(users.logout)

router.route('/addFriend')
    .get(isLoggedIn, catchAsync(users.renderAddFriend))

router.route('/:id/addFriend')
    .put(isLoggedIn, catchAsync(users.addFriend))

router.route('/:id')
    .put(isLoggedIn, validateUser, catchAsync(users.editUser))
    .delete(isLoggedIn, catchAsync(users.deleteUser))

router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(users.renderEditUser))

module.exports = router;