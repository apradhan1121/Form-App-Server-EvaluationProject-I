const jwt = require('jsonwebtoken')

const isUserLoggedIn = (req, res, next) => {
    try {
        console.log("Verifing the token in the backend ")
        const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
        const user = jwt.verify(token, process.env.JWT_PRIVATEKEY);
        req.user = user;
        console.log("Token verified successfull")
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'FAILED',
            message: 'Please log in to access this resource'
        });
    }
};

const isAdmin = (req,res,next)=>{
    // const isAdminaccess = true
    console.log(req.user)
    const {IsAdmin} = req.user
    if(IsAdmin){
        next()
    }
    else{
        return res.json({
            status:"FAILED",
            message:"Please have admin access to access it"
        })
    }
}

const isPremiumUser = (req,res,next)=>{
    // const isPremium=true
    console.log(req.user)
    const {IsPremium} = req.user

    if(IsPremium){
        next()
    }
    else{
        res.send({
            status:"FAILED",
            message:"NOT a premium user, please subscribe to access it"
        })
    }
}

module.exports ={
    isUserLoggedIn,
    isAdmin,
    isPremiumUser
}