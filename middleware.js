module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl // seems to only work with passport version 0.5.0
        console.log(req.session.returnTo)
        req.flash('error', 'You must be logged in to edit a user!')
        return res.redirect('/login')
    }
    next()
}