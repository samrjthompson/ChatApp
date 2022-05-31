const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const UserModel = require('./models/user')
const ExpressError = require('./utils/ExpressError')
const userRouter = require('./routes/user')
const messageBoardRouter = require('./routes/messageBoard')
const remoteUrl = 'mongodb+srv://Sam:AleEEEOirAqGGl86@cluster0.ncr0l.mongodb.net/?retryWrites=true&w=majority'
const localUrl = 'mongodb://localhost:27017/chat-app'
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

// MIDDLEWARE
app.engine('ejs', ejsMate)
app.use(express.urlencoded({extended: true})) // ensures urlencoded data can be parsed by express when we call req.body
//app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // ensures that client cannot expose cookie to third party
        expires: Date.now() + 1000 * 60 * 30, // cookie expires in 30 mins - 1000ms * 60 (1 min) * 30 (30 mins)
        maxAge: 1000 * 60 * 30 // maxAge = 30 mins
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy (UserModel.authenticate()))

passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.use((req, res, next) => {
    // this adds the key 'success' to res.locals and so can be accessed anywhere by ejs files under the key 'success'
    // then anything that is assigned to 'success' as a req.flash.. will be added to this
    // e.g., req.flash('success', 'Well done!') will add the string 'Well done!' to the 'success' variable
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

// these two ensure the app.get or app.post code refers to rootdirectory/views folder
// e.g. res.render('campgrounds/show') refers to ~/views/campgrounds/show.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/', userRouter);
app.use('/', messageBoardRouter);

// if none of the above requests are hit, then this will be hit - * means anything in the url
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404,));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})

// LISTEN
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})