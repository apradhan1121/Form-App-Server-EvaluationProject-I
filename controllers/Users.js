const Users = require('../models/Users.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



getUser = async(req,res)=>{
    try{
    console.log("GET is used");
    const User = await Users.find()
    res.json({
        status:200,
        data: User
    })
    }
    catch(error){
        console.log(error)
        res.json({
            status:500,
            message:"internal server error"
        })
    }
}


SignUpUser = async(req,res)=>{
    try{
    console.log(req.body)
    const {fname,lname,username,email, password} = req.body

    //Encrypting the password while signing up
    const encryptedpassword = await bcrypt.hash(password,10)
    await Users.create({fname,lname,username, email, password:encryptedpassword})
    console.log("Customer data stored in db")
    res.json({
        status:"success"
    })
    }
    catch(error){
        console.log("Failed to do a post operation in the db, error: ",error)
        res.json({
            status:500,
            message:"internal server error"
        })
    }
}


LoginUser = async(req,res)=>{
    try{
       const {email, password} =  req.body
       console.log(req.body)
       const checkemail = await Users.findOne({email}).lean();
       if(!checkemail){
        return res.json({
            status:"FAILED",
            message:"email not found"
        })}
        console.log("email validated")

        const passwordCompared = await bcrypt.compare(password, checkemail.password)
        if(!passwordCompared){
            return res.json({
                message:"Incorrect password"
            })
        }

        console.log("password validated")

/*         Once the credientailas are validated then creating a token so that it will be validated for the session
         for creating token we are passing our username as a source for creating a token */

        const jwtToken = jwt.sign(checkemail, process.env.JWT_PRIVATEKEY, {expiresIn:300})
        console.log("Token is generated attached token ",passwordCompared)



    //    const LoggedUser = await Users.findOne({username,password})
       if(passwordCompared){
        console.log("Password compared successful that is true")
        res.send({
            status:"Success",
            message: "Logged in successfull",
            token:jwtToken
        })
       }
       else{
        res.send({
            status:"Failed",
            message:"Invalid crediatinals"
        })
       }
    }
    catch(error){
        console.log("Error occured during login",error)
        res.send({
            status:"Failed to Fetch login credientals"
        })
    }
}

module.exports = {getUser, SignUpUser, LoginUser}