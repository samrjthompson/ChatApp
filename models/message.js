const mongoose = require('mongoose');
const user = require('./user');
const messageBoard = require('./messageBoard')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    text: String,
    senderId: String,
    messageBoardId: String
})

module.exports = mongoose.model('Message', MessageSchema)