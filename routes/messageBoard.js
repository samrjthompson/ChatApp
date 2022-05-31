const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const { isAuthor } = require('../middleware')

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const { messageBoardSchema } = require('../schemas')

// MODELS
const MessageBoard = require('../models/messageBoard')

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
router.get('/messageBoards/new', isLoggedIn, (req, res) => {
    res.render('messageBoards/new')
})

router.post('/messageBoards', isLoggedIn, catchAsync(async (req, res, next) => {
    const newMessageBoard = new MessageBoard(req.body)
    newMessageBoard.authorId = req.user._id; // we can use req.user because of the passport module to get current user
    await newMessageBoard.save()
    res.redirect(`messageBoards/${newMessageBoard._id}`)
}))
/* ################################################# */

// READ
router.get('/messageBoards', isLoggedIn, async (req, res) => {
    // find all messageBoards with the authorId of the current user
    const messageBoards = await MessageBoard.find({"authorId": req.user._id})
    if(messageBoards.length === 0) {
        req.flash('error', 'You have no message boards! Please create one...')
        return res.redirect('/messageBoards/new')
    }
    res.render('messageBoards/index', { messageBoards })
})

router.get('/messageBoards/:id', isLoggedIn, catchAsync(async (req, res) => {
    // populate finds the object with that id in the db and adds it to the messageBoard object here (not in the db)
    const messageBoard = await MessageBoard.findById(req.params.id).populate('authorId')
    console.log(messageBoard)
    res.render('messageBoards/show', { messageBoard })
}))
/* ################################################# */

// UPDATE
router.get('/messageBoards/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/edit', { messageBoard })
}))

router.put('/messageBoards/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const mb = await MessageBoard.findByIdAndUpdate(id, req.body.messageBoard)
    res.redirect(`/messageBoards/${mb._id}`)
}))
/* ################################################# */

// DELETE
router.delete('/messageBoards/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await MessageBoard.findByIdAndDelete(req.params.id)
    res.redirect('/messageBoards')
}))

module.exports = router;