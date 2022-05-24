const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')

const AppError = require('./AppError')

const dbUrl = 'mongodb+srv://Sam:AleEEEOirAqGGl86@cluster0.ncr0l.mongodb.net/?retryWrites=true&w=majority'

// MODELS
const User = require('./models/user')
const MessageBoard = require('./models/messageBoard')
/* ################################################# */

const port = 3000
//'mongodb://localhost:27017/chat-app'
// CONNECTION SETUP
mongoose.connect(dbUrl)
.then(() => {
    console.log('MONGO CONNECTION OPEN!')
})
.catch(err => {
    console.log('ERROR: MONGO Connection Failed!')
    console.log(err)
})
/* ################################################# */

// MIDDLEWARE
app.engine('ejs', ejsMate)
app.use(express.urlencoded({extended: true})) // ensures urlencoded data can be parsed by express when we call req.body
//app.use(express.json())
app.use(methodOverride('_method'))
/* ################################################# */

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

/* USER SETUP */

// CREATE
app.get('/users/new', (req, res) => {
    res.render('users/new')
})

app.post('/users', async (req, res) => {
    const newUser = new User(req.body)
    await newUser.save()
    res.redirect(`users/${newUser._id}`)
})
/* ################################################# */

// READ
app.get('/users', async (req, res) => {
    const users = await User.find({})
    res.render('users/index', { users })
})

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/show', { user })
})
/* ################################################# */

// UPDATE
app.get('/users/:id/edit', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user })
})

app.put('/users/:id', async (req, res) => {
    const {id} = req.params
    const user = await User.findByIdAndUpdate(id, req.body.user)
    res.redirect(`/users/${user._id}`)
})
/* ################################################# */

// DELETE
app.delete('/users/:id', async (req, res) => {
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.redirect('/users')
})
/* ################################################# */



/* MESSAGE BOARD SETUP */

// CREATE
app.get('/messageBoards/new', (req, res) => {
    res.render('messageBoards/new')
})

app.post('/messageBoards', async (req, res) => {
    const newMessageBoard = new MessageBoard(req.body)
    await newMessageBoard.save()
    res.redirect(`messageBoards/${newMessageBoard._id}`)
})
/* ################################################# */

// READ
app.get('/messageBoards', async (req, res) => {
    const messageBoards = await MessageBoard.find({})
    res.render('messageBoards/index', { messageBoards })
})

app.get('/messageBoards/:id', async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/show', { messageBoard })
})
/* ################################################# */

// UPDATE
app.get('/messageBoards/:id/edit', async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/edit', { messageBoard })
})

app.put('/messageBoards/:id', async (req, res) => {
    const messageBoard = await MessageBoard.findByIdAndUpdate(req.params.id, req.body.messageBoard)
    res.redirect(`/messageBoards/${messageBoard._id}`)
})
/* ################################################# */

// DELETE
app.delete('/messageBoards/:id', async (req, res) => {
    await MessageBoard.findByIdAndDelete(req.params.id)
    res.redirect('/messageBoards')
})
/* ################################################# */



//////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})