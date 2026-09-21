const User = require('../models/userschema');
const validator = require('../utils/valid');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redis = require('../confi/redis');
const crypto = require("crypto");
const transporter = require('../utils/nodemailer')

const register = async (req, res) => {
  try {
    // Input Validate Karo
    valid(req.body);

    const { firstName, emailId, password } = req.body;

    // Check duplicate email before hashing to give clean error
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered. Please login instead.",
      });
    }

    // Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, firstName: firstName },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
    };

    return res.status(201).json({
      user: reply,
      message: "REGISTER Successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already registered. Please login instead.",
      });
    }
    return res.status(400).json({
      message: err.message || "Registration failed",
    });
  }
};
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        message: "Crendential Invalid.",
      });
    }

    // Email check karo
    const user = await User.findOne({ emailId });

    // AGAR USER NAHI HAI -> Frontend ko Signup karne ko bolo
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please signup first.",
        needSignup: true, // Frontend flag to easily redirect to signup
      });
    }

    // Password Match check karo
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    // Generate Token
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, firstName: user.firstName },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
    };

    return res.status(200).json({
      user: reply,
      message: "Logged in successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
const logout = async (req , res) => {
   try{
      const {token} = req.cookies;
      const payload = jwt.decode(token);
      await redis.set(`token:${token}` , 'Blocked');
      await redis.expireAt(`token:${token}`, payload.exp );     
      res.cookie("token","",{expires: new Date(0)});
      res.send("Logged_Out Successfully");
   }
   catch(err){
        res.status(503).send("Error : " + err);
   } 
}
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user =
      await User.findOne({
        emailId: email
      });
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists, a reset link has been sent."
        });
    }

    // Generate raw token
    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      console.log("call3"); 


    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires =
     Date.now() + 15 * 60 * 1000; 
     await user.save();
       

    const resetLink =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.emailId,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>
          You requested a password reset.
        </p>
        <p>
          Click below:
        </p>
        <a href="${resetLink}">
          Reset Password
        </a>
        <p>
          This link expires in 15 minutes.
        </p>
        <p>
          Ignore this email if you didn't request it.
        </p>
      `
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, a reset link has been sent."
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
const resetPassword = async (req, res) => {
  try {

    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password required"
      });
    }

    // hash incoming token
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now() 
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // token becomes single-use
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
module.exports = {register , login , logout ,resetPassword , forgotPassword};




