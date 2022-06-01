const MessageBoard = require('../models/messageBoard')
const User = require('../models/user')

module.exports.renderCreateBoard = (req, res) => {
    res.render('messageBoards/new')
}

module.exports.createBoard = async (req, res) => {
    const newMessageBoard = new MessageBoard(req.body.mb)
    const currentUser = req.user

    newMessageBoard.authorId = currentUser._id;
    currentUser.messageBoardIds.push(newMessageBoard._id)

    await User.findByIdAndUpdate(currentUser._id, currentUser)
    await newMessageBoard.save()

    res.redirect(`messageBoards/${newMessageBoard._id}`)
}

module.exports.renderMessageBoards = async (req, res) => {
    const messageBoardIds = req.user.messageBoardIds
    // finds all messageBoards with the given id and returns them as an array
    const foundMessageBoards = await MessageBoard.find({"_id": messageBoardIds})

    if(foundMessageBoards.length === 0) {
        req.flash('error', 'You have no message boards! Please create one...')
        return res.redirect('/messageBoards/new')
    }
    res.render('messageBoards/index', { foundMessageBoards })
}

module.exports.renderMessageBoard = async (req, res) => {
    // populate finds the object with that id in the db and adds it to the messageBoard object here (not in the db)
    const { id } = req.params
    const messageBoard = await MessageBoard.findById(id).populate({
        path:'authorId',
        populate: {
            path: 'firstName' // this is an example of a nested populate - so we're populating from an object on the author object that has been populated on the messageBoard
        }
    })
    res.render('messageBoards/show', { messageBoard })
}

module.exports.renderEditMessageBoard = async (req, res) => {
    const messageBoard = await MessageBoard.findById(req.params.id)
    res.render('messageBoards/edit', { messageBoard })
}

module.exports.editMessageBoard = async (req, res) => {
    const { id } = req.params
    const mb = await MessageBoard.findByIdAndUpdate(id, req.body.messageBoard)
    res.redirect(`/messageBoards/${mb._id}`)
}

module.exports.leaveMessageBoard = async (req, res) => {
    const { id } = req.params
    const currentUser = req.user
    const userId = currentUser._id
    const messageBoardIds = currentUser.messageBoardIds

    for(i = 0; i < messageBoardIds.length; i++) {
        if(messageBoardIds[i] == id) {
            messageBoardIds.splice(i, 1)
            break
        }
    }
    await User.findByIdAndUpdate(userId, currentUser)
    res.redirect('/messageBoards')
}

module.exports.renderAddUserToBoard = async (req, res) => {
    const { id } = req.params
    const user = req.user
    const friendIdList = user.friendIds
    const friendList = await User.find({"_id": friendIdList})
    
    res.render('messageBoards/addUser', { id, user, friendList })
}

module.exports.addUserToGroup = async (req, res) => {
    const { id } = req.params
    const { username } = req.body      
    const userToAdd = await User.findOne({"username": username}) // findOne returns an actual object rather than just a document
    const { messageBoardIds } = userToAdd

    if(!userToAdd) {
        req.flash('error', 'Could not find that user, please try again')
        return res.redirect(`/messageBoards/${id}/addUserToGroup`)
    }

    messageBoardIds.push(id)
    await User.findByIdAndUpdate(userToAdd._id, userToAdd)

    res.redirect(`/messageBoards/${id}`)
}

module.exports.deleteMessageBoard = async (req, res) => {
    await MessageBoard.findByIdAndDelete(req.params.id)
    res.redirect('/messageBoards')
}