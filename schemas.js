const Joi = require('joi')

module.exports.userSchema = Joi.object({
    user: Joi.object({
        firstName: Joi.string().alphanum().required(),
        lastName: Joi.string().alphanum().required(),
        username: Joi.string().required(),
        image: Joi.string().required(),
        bio: Joi.string().required()
    }).required() // ensure user is an object and is required
})

module.exports.messageBoardSchema = Joi.object({
    messageBoard: Joi.object({
        name: Joi.string().alphanum().required()
    }).required()
})