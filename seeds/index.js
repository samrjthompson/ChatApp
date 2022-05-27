const mongoose = require('mongoose')
const methodOverride = require('method-override')
const User = require('../models/user')
const people = require('./people')

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
/* ################################################# */

const seedDB = async () => {
    await User.deleteMany({}) // deletes everything in db
    for(let i = 0; i < 6; i++) {
        const newUser = new User({
            firstName: `${people[i].firstName}`,
            lastName: `${people[i].lastName}`,
            username: `${people[i].username}`,
            image: 'https://source.unsplash.com/collection/483251',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit quidem, dolorum consequatur doloribus omnis iure reiciendis, accusantium mollitia eaque earum dignissimos error libero unde autem nostrum magni beatae illum aperiam?'
        })
        await newUser.save()
    }
}

seedDB()
.then(() => {
    mongoose.connection.close()
})