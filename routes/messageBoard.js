const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
//const { messageBoardSchema } = require('../schemas')

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
router.get('/messageBoards/new', (req, res) => {
    res.render('messageBoards/new')
})

router.post('/messageBoards', catchAsync(async (req, res, next) => {
    const newMessageBoard = new MessageBoard(req.body)
    await newMessageBoard.save()
    res.redirect(`messageBoards/${newMessageBoard._id}`)
}))
/* ################################################# */

// READ
router.get('/messageBoards', async (req, res) => {
    const messageBoards = await MessageBoard.find({})
    res.render('messageBoards/index', { messageBoards })
})

router.get('/messageBoards/:id', catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/show', { messageBoard })
}))
/* ################################################# */

// UPDATE
router.get('/messageBoards/:id/edit', catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/edit', { messageBoard })
}))

router.put('/messageBoards/:id', catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findByIdAndUpdate(req.params.id, req.body.messageBoard)
    res.redirect(`/messageBoards/${messageBoard._id}`)
}))
/* ################################################# */

// DELETE
router.delete('/messageBoards/:id', catchAsync(async (req, res) => {
    await MessageBoard.findByIdAndDelete(req.params.id)
    res.redirect('/messageBoards')
}))

module.exports = router;