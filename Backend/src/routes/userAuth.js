const express = require('express');
const authRouter = express.Router();
const  {register , login , logout , forgotPassword , resetPassword} =  require('../controllers/userauthent');
const userMiddelware = require('../middleware/usermiddleware');

authRouter.post('/register' , register);
authRouter.post('/login' , login);
authRouter.post('/logout' , userMiddelware ,  logout);

authRouter.get('/check' , userMiddelware , (req , res)=>{
     console.log("aa rhi hai request ");
     const reply = {
        firstName : req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id
     }
     res.status(200).json({
       user : reply, 
       message : "Valid User" 
     });
})
authRouter.post('/forgot-password' , forgotPassword);
authRouter.post("/reset-password", resetPassword);



module.exports = authRouter;
