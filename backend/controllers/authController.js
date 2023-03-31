const User = require('../models/userModel'); // User model
const Role = require('../models/roleModel'); // Role model
const bcrypt = require('bcrypt'); // Hashing password
const jwt=require('jsonwebtoken'); // Encrypting token
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async(req, res, next) => {
    let reqUser = {...req.body};
    
    if(!reqUser.password || !reqUser.email) return next(new AppError('Please provide an email and a password', 400));
    else if(!reqUser.passwordConfirm) return next(new AppError('Please confirm your password !', 400));

    let role;
    if(reqUser.role){
        if (typeof reqUser.role === "string") {
        role = await Role.findOne({ "name": reqUser.role });
        } else {
        role = await Role.findOne({ "_id": reqUser.role });
        }
        reqUser.role = role._id;
    } else {
        console.log("he doesn't have a role");
        role = await Role.findOne({ name: 'default' })
        reqUser.role = role._id;
    }

    const newUser = new User({
        email: reqUser.email,
        password: reqUser.password,
        passwordConfirm: reqUser.passwordConfirm,
        role: reqUser.role         
    });
    newUser.joiValidate(reqUser);
    await newUser.save();
    return res.status(201).json({ message: "utilisateur crée!" });
});
  
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    if(!email || !password) return next(new AppError('Please provide an email and a password', 400));

    const freshUser = await User.findOne({"email": email}).select('+password');

    if (!freshUser || !await freshUser.isPasswordCorrect(password, freshUser.password)) return next(new AppError('Incorrect email or password !', 401));

    const token=jwt.sign(
        { userId: freshUser._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    res.cookie('jwt', token, { httpOnly: true });
    
    return res.status(200)
    .json({
        userId: freshUser._id,
        token: token
    });
});


