/*
The middleware, aside from being cleaner and more organised, prevents people from submitting requests using apps 
like postman 
*/

// MODELS
const MessageBoard = require('./models/messageBoard')
const ExpressError = require('./utils/ExpressError')
const { userSchema } = require('./schemas')

// checks to see if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    // req.isAuthenticated is another passport method
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl // seems to only work with passport version 0.5.0
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(element => element.message).join(',') // for each element return element.message and join on a comma if more than one message
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

// checks to see if user is the authro (i.e., primary admin)
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const messageBoard = await MessageBoard.findById(id);
    if(!messageBoard.authorId.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that...')
        return res.redirect(`/messageBoards/${id}`)
    } 
    next()
}