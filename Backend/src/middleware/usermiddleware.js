const jwt = require("jsonwebtoken");
const User = require("../models/userschema");
const redis = require("../confi/redis")
const userMiddleware = async (req , res , next)=>{
     try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not present");
        }

        
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const {_id} = payload;
        if(!_id)
            throw new Error("Invalid Token");
        
        const result = await User.findById(_id);
        if(!result)
            throw new Error("User is not present");


        const isBlocked = await redis.exists(`token:${token}`);  
        if(isBlocked) 
            throw new Error('Invalid Token');


        req.result = result;   
        
        next();
    }
    catch(err){
        return res.status(401).json({
            message: err.message
    });
}
}

module.exports = userMiddleware;