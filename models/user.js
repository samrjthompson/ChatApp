const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    image: String,
    bio: String
})

module.exports = mongoose.model('User', UserSchema)