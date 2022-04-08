const mongoose = require('mongoose');
const user = require('./user');
const message = require('./message')
const Schema = mongoose.Schema

const MessageBoardSchema = new Schema({
    name: String,
    numOfUsers: Number,
    messagesIds: [String],
    memberIds: [String]
})

module.exports = mongoose.model('MessageBoard', MessageBoardSchema)