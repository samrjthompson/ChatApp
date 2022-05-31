const mongoose = require('mongoose');
const user = require('./user');
const messageBoard = require('./messageBoard')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const MessageSchema = new Schema({
    text: String,
    userId: String,
    messageBoardId: String
})

module.exports = mongoose.model('Message', MessageSchema)