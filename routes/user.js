const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn, validateUser } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

// MODELS
const User = require('../models/user')
const messageBoard = require('../models/messageBoard')

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

router.get('/register', (req, res) => {
    // if user is already logged in...
    if(req.user) {
        req.flash('error', 'You must be logged out before registering a new user!')
        return res.redirect('/users')
    }
    res.render('users/register')
})

router.post('/register', catchAsync (async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) {
                return next(err)
            }
            req.flash('success', 'Welcome to ChatApp!')
            res.redirect(`/users/${registeredUser._id}`)
        })
    }
    catch(e) {
        req.flash('error', e.message)
        res.redirect('/')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // all the logic for contacting the db and authenticating is done by 'passport' automatically
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/users' // if returnTo is defined, then go there. If not, then go to /users
    delete req.session.returnTo // set returnTo to undefined
    res.redirect(redirectUrl)
})

// CREATE
router.get('/users/new', (req, res) => {
    res.render('users/new')
})

router.post('/users', validateUser, catchAsync(async (req, res, next) => {
    const newUser = new User(req.body.user)
    await newUser.save()
    res.redirect(`users/${newUser._id}`)
}))

// READ
router.get('/users', async (req, res) => {
    const users = await User.find({})
    res.render('users/index', { users })
})

router.get('/users/:id', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        req.flash('error', 'User not found!')
        return res.redirect('/users')
    }
    res.render('users/show', { user })
}))

// UPDATE
router.get('/users/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        req.flash('error', 'User not found!')
        return res.redirect('/users')
    }
    res.render('users/edit', { user })
}))

router.put('/users/:id', isLoggedIn, validateUser, catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, req.body.user)
    req.flash('success', 'Successfully updated user!')
    res.redirect(`/users/${user._id}`)
}))

// DELETE
router.delete('/users/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted user')
    res.redirect('/users')
}))

router.get('/logout', (req, res, next) => {
    req.logout()
    req.flash('success', 'You have successfully logged out!')
    res.redirect('/users')
})

module.exports = router;