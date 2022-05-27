const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const Joi = require('joi')

const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

const remoteUrl = 'mongodb+srv://Sam:AleEEEOirAqGGl86@cluster0.ncr0l.mongodb.net/?retryWrites=true&w=majority'
const localUrl = 'mongodb://localhost:27017/chat-app'

// MODELS
const User = require('./models/user')
const MessageBoard = require('./models/messageBoard')
/* ################################################# */

const port = 3000

// CONNECTION SETUP
mongoose.connect(remoteUrl)
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

app.post('/users', catchAsync(async (req, res, next) => {
    const userSchema = Joi.object({
        user: Joi.object({
            firstName: Joi.string().alphanum().required(),
            lastName: Joi.string().alphanum().required(),
            username: Joi.string().required(),
            image: Joi.string().required(),
            bio: Joi.string().required()
        }).required() // ensure user is an object and is required
    })

    const {error} = userSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(element => element.message).join(',') // for each element return element.message and join on a comma if more than one message
        throw new ExpressError(msg, 400)
    }

    const newUser = new User(req.body)
    await newUser.save()
    res.redirect(`users/${newUser._id}`)
}))
/* ################################################# */

// READ
app.get('/users', async (req, res) => {
    const users = await User.find({})
    res.render('users/index', { users })
})

app.get('/users/:id', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/show', { user })
}))
/* ################################################# */

// UPDATE
app.get('/users/:id/edit', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user })
}))

app.put('/users/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const user = await User.findByIdAndUpdate(id, req.body.user)
    res.redirect(`/users/${user._id}`)
}))
/* ################################################# */

// DELETE
app.delete('/users/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.redirect('/users')
}))
/* ################################################# */



/* MESSAGE BOARD SETUP */

// CREATE
app.get('/messageBoards/new', (req, res) => {
    res.render('messageBoards/new')
})

app.post('/messageBoards', catchAsync(async (req, res, next) => {
    const newMessageBoard = new MessageBoard(req.body)
    await newMessageBoard.save()
    res.redirect(`messageBoards/${newMessageBoard._id}`)
}))
/* ################################################# */

// READ
app.get('/messageBoards', async (req, res) => {
    const messageBoards = await MessageBoard.find({})
    res.render('messageBoards/index', { messageBoards })
})

app.get('/messageBoards/:id', catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/show', { messageBoard })
}))
/* ################################################# */

// UPDATE
app.get('/messageBoards/:id/edit', catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/edit', { messageBoard })
}))

app.put('/messageBoards/:id', catchAsync(async (req, res) => {
    const messageBoard = await MessageBoard.findByIdAndUpdate(req.params.id, req.body.messageBoard)
    res.redirect(`/messageBoards/${messageBoard._id}`)
}))
/* ################################################# */

// DELETE
app.delete('/messageBoards/:id', catchAsync(async (req, res) => {
    await MessageBoard.findByIdAndDelete(req.params.id)
    res.redirect('/messageBoards')
}))
/* ################################################# */



//////////////////////////////////////////////////////

// if none of the above requests are hit, then this will be hit - * means anything in the url
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404,));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})