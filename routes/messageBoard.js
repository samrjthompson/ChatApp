const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const { isLoggedIn, isAuthor, validateMessageBoard } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

// MODELS
const MessageBoard = require('../models/messageBoard')
const User = require('../models/user')
const ExpressError = require('../utils/ExpressError')

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// CREATE
router.get('/messageBoards/new', isLoggedIn, (req, res) => {
    res.render('messageBoards/new')
})

router.post('/messageBoards', isLoggedIn, validateMessageBoard, catchAsync(async (req, res, next) => {
    const newMessageBoard = new MessageBoard(req.body.messageBoard)
    const currentUser = req.user
    
    newMessageBoard.authorId = currentUser._id;
    currentUser.messageBoardIds.push(newMessageBoard._id) 

    await User.findByIdAndUpdate(currentUser._id, currentUser) // updates current user on db with new messageBoard id
    await newMessageBoard.save()
    res.redirect(`messageBoards/${newMessageBoard._id}`)
}))

// READ
router.get('/messageBoards', isLoggedIn, async (req, res) => {
    const messageBoardIds = req.user.messageBoardIds
    // finds all messageBoards with the given id and returns them as an array
    const messageBoards = await MessageBoard.find({"_id": messageBoardIds})

    if(messageBoards.length === 0) {
        req.flash('error', 'You have no message boards! Please create one...')
        return res.redirect('/messageBoards/new')
    }
    res.render('messageBoards/index', { messageBoards })
})

router.get('/messageBoards/:id', isLoggedIn, catchAsync(async (req, res) => {
    // populate finds the object with that id in the db and adds it to the messageBoard object here (not in the db)
    const { id } = req.params
    const messageBoard = await MessageBoard.findById(id).populate({
        path:'authorId',
        populate: {
            path: 'firstName' // this is an example of a nested populate - so we're populating from an object on the author object that has been populated on the messageBoard
        }
    })
    console.log(messageBoard)
    res.render('messageBoards/show', { messageBoard })
}))

// UPDATE
router.get('/messageBoards/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/edit', { messageBoard })
}))

router.put('/messageBoards/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const mb = await MessageBoard.findByIdAndUpdate(id, req.body.messageBoard)
    res.redirect(`/messageBoards/${mb._id}`)
}))

// DELETE
router.delete('/messageBoards/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await MessageBoard.findByIdAndDelete(req.params.id)
    res.redirect('/messageBoards')
}))

module.exports = router;