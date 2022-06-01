const User = require('../models/user')

module.exports.renderFriendsList = async (req, res) => {
    const currentUser = req.user
    const friendIdList = currentUser.friendIds
    const friendList = await User.find({"_id": friendIdList})
    res.render('users/show', { friendList })
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) {
                return next(err)
            }
            req.flash('success', 'Welcome to ChatApp!')
            res.redirect(`/users/${registeredUser._id}`)
        })
    }
    catch(e) {
        req.flash('error', e.message)
        res.redirect('/')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}

module.exports.renderAddFriend = async (req, res) => {
    const users = await User.find({})
    res.render('users/addFriend', { users })
}

module.exports.addFriend = async (req, res) => {
    const { id } = req.params
    const currentUser = req.user
    currentUser.friendIds.push(id)
    await User.findByIdAndUpdate(currentUser._id, currentUser)
    
    res.send(currentUser.friendIds)
}

module.exports.renderEditUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        req.flash('error', 'User not found!')
        return res.redirect('/users')
    }
    res.render('users/edit', { user })
}

module.exports.editUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, req.body.user)
    req.flash('success', 'Successfully updated user!')
    res.redirect(`/users/${user._id}`)
}

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted user')
    res.redirect('/users')
}