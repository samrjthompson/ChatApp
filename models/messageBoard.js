const mongoose = require('mongoose');
const user = require('./user');
const message = require('./message')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const MessageBoardSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    adminIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    name: String,
    numOfUsers: Number,
    messagesIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    memberIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model('MessageBoard', MessageBoardSchema)