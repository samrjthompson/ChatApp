const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const { isLoggedIn, isAuthor, validateMessageBoard } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const messageBoards = require('../controllers/messageBoard')

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

router.route('/new')
    .get(isLoggedIn, messageBoards.renderCreateBoard)
    
router.route('/')
    .get(isLoggedIn, catchAsync(messageBoards.renderMessageBoards))
    .post(isLoggedIn, catchAsync(messageBoards.createBoard))

router.route('/:id')
    .get(isLoggedIn, catchAsync(messageBoards.renderMessageBoard))
    .put(isLoggedIn, isAuthor, catchAsync(messageBoards.editMessageBoard))
    .delete(isLoggedIn, isAuthor, catchAsync(messageBoards.deleteMessageBoard))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(messageBoards.renderEditMessageBoard))
    
router.route('/:id/leave')
    .put(isLoggedIn, catchAsync(messageBoards.leaveMessageBoard))

router.route('/:id/addUserToGroup')
    .get(isLoggedIn, isAuthor, catchAsync(messageBoards.renderAddUserToBoard))
    .post(isLoggedIn, isAuthor, catchAsync(messageBoards.addUserToGroup))

module.exports = router;