const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const User = require('./models/user')

const port = 3000

// CONNECTION SETUP
mongoose.connect('mongodb://localhost:27017/chat-app')
.then(() => {
    console.log('MONGO CONNECTION OPEN!')
})
.catch(err => {
    console.log('ERROR: MONGO Connection Failed!')
    console.log(err)
})
/* ################################################# */

// MIDDLEWARE
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

// READ
app.get('/users', async (req, res) => {
    const users = await User.find({})
    res.render('users/index', { users })
})

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/show', { user })
})


//////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})