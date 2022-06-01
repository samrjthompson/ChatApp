const mongoose = require('mongoose')
const User = require('../models/user')

const remoteUrl = 'mongodb+srv://Sam:AleEEEOirAqGGl86@cluster0.ncr0l.mongodb.net/?retryWrites=true&w=majority'
const localUrl = 'mongodb://localhost:27017/chat-app'

// CONNECTION SETUP
mongoose.connect(remoteUrl)
.then(() => {
    console.log('MONGO CONNECTION OPEN!')
})
.catch(err => {
    console.log('ERROR: MONGO Connection Failed!')
    console.log(err)
})

const fixDb = async () => {
    const lucy = await User.findOne({"username": "Lucy"})
}

fixDb()
.then(() => {
    mongoose.connection.close()
})