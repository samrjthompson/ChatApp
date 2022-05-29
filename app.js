const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')

const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

const userRouter = require('./routes/user')
const messageBoardRouter = require('./routes/messageBoard')

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


// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', userRouter);
app.use('/', messageBoardRouter);


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