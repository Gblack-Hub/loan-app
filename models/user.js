"use strict"

const Mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const user_schema = new Mongoose.Schema({
	user_name: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true },
}, { timestamps })

user_schema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

user_schema.statics.findByDetails = async (user_name, password) => {
    // Search for a user by username and password.
    const user = await User.findOne({ user_name } )
    if (!user) {
      return res.status(400).send({ error: `Username ${ user_name } does not exist`})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(400).send({ error: "Provided password does not match" })
    }
    return user
}

const User = Mongoose.model('User', user_schema)

module.exports = User;