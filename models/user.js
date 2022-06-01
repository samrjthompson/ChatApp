const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    messageBoardIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'MessageBoard'
        }
    ],
    friendIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Friends'
        }
    ],
    firstName: String,
    lastName: String,
    //username: String,
    image: String,
    bio: String
})

UserSchema.plugin(passportLocalMongoose)

// UserSchema.statics.findAndValidate = async function(username, password) {
//     const foundUser = await this.findOne({ username })
//     if(!foundUser) return false
    
//     const isValid = await bcrypt.compare(password, foundUser.password)
//     return isValid ? foundUser : false
// }

module.exports = mongoose.model('User', UserSchema)