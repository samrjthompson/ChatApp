const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const { userSchema } = require('../schemas')

// MODELS
const User = require('../models/user')

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(element => element.message).join(',') // for each element return element.message and join on a comma if more than one message
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

// CREATE
router.get('/users/new', (req, res) => {
    res.render('users/new')
})

router.post('/users', validateUser, catchAsync(async (req, res, next) => {
    const newUser = new User(req.body.user)
    await newUser.save()
    res.redirect(`users/${newUser._id}`)
}))
/* ################################################# */

// READ
router.get('/users', async (req, res) => {
    const users = await User.find({})
    res.render('users/index', { users })
})

router.get('/users/:id', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/show', { user })
}))
/* ################################################# */

// UPDATE
router.get('/users/:id/edit', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user })
}))

router.put('/users/:id', validateUser, catchAsync(async (req, res) => {
    const {id} = req.params
    const user = await User.findByIdAndUpdate(id, req.body.user)
    res.redirect(`/users/${user._id}`)
}))
/* ################################################# */

// DELETE
router.delete('/users/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.redirect('/users')
}))

module.exports = router;