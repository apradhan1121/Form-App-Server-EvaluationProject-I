const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const path = require('path');


dotenv.config()
const bodyParser = require('body-parser')
const UserRouter = require('./routes/Users.js')
const FormRouter = require('./routes/Forms.js');

const {isUserLoggedIn} = require('./middleware/Users.js')
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded())
app.use(UserRouter)
app.use(FormRouter);


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.send({ status: 200, now: new Date() });
});

app.get('/verifyToken', isUserLoggedIn, (req, res) => {
    res.json({
        status: 'SUCCESS',
        message: 'Welcome to the user dashboard',
        user: req.user // Include user information in the response
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(process.env.PORT, (req,res)=>{
     mongoose.connect("mongodb+srv://abhijitpradhan1536:Abhijit1121@cluster1.hqzvmpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
    .then(()=>
        console.log("db connected")

    )
    .catch((e)=>{
        console.log("Cannot connect to db with error: ", e)
    })
})
