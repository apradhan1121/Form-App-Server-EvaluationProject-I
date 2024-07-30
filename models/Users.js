const mongoose = require('mongoose')
const User = mongoose.model('User',{
    fname:String,
    lname:String,
    username:String,
    email:String,
    password:String
})

module.exports = User