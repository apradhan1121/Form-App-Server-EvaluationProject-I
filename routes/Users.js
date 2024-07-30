const express = require('express')
const router = express.Router()

const {
    getUser,
    SignUpUser, LoginUser
} = require('../controllers/Users.js')

router.get('/User',getUser)

router.post('/User/signup',SignUpUser)

router.post('/User/LoginUser',LoginUser)

module.exports= router