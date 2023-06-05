const User = require('../models/userModel'); // User model
const Role = require('../models/roleModel'); // Role model
const bcrypt = require('bcrypt'); // Hashing password
const jwt=require('jsonwebtoken'); // Encrypting token
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { default: mongoose } = require('mongoose');

exports.signup = catchAsync(async(req, res, next) => {
    let reqUser = {...req.body};
    reqUser._id = mongoose.Types.ObjectId();

    if(!reqUser.password || !reqUser.email) return next(new AppError('Please provide an email and a password', 400));
    else if(!reqUser.passwordConfirm) return next(new AppError('Please confirm your password !', 400));

    let role;
    if(reqUser.role){
        if (typeof reqUser.role === "string") {
        role = await Role.findOne({ "name": reqUser.role });
        } else {
        role = await Role.findOne({ "_id": reqUser.role });
        }
        if(role?.id) reqUser.role = role._id;
        else res.status(400).json({ message: "Cannot sign up because the role is not found" });
    } else {
        console.log("he doesn't have a role");
        role = await Role.findOne({ name: 'default' })
        reqUser.role = role._id;
    }

    let myManager;
    if(reqUser.manager){
        console.log("reqUser.manager", reqUser.manager);
        console.log("reqUser._id", reqUser._id);
        myManager = await User.findById(reqUser.manager);
        if(!myManager) return res.status(400).json({ message: "Cannot sign up because the manager is not found" });
        myManager.manages.push(reqUser._id);
        await myManager.save();
    }

    const newUser = new User(reqUser);
    newUser.joiValidate(reqUser);
    const [user] = await Promise.all([newUser.save(), myManager?.save()]);
    await user.populate({
        path: 'role jobTitle',
        match: { deleted: { $ne: true } }
    });
    return res.status(201).json({ message: "utilisateur crée!", user });
});
  
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) return next(new AppError('Please provide an email and a password', 400));
    
    const freshUser = await User.findOne({"email": email}).select('+password').populate({
        path: 'role',
        match: { deleted: { $ne: true } }
    });

    if (!freshUser || !await freshUser.isPasswordCorrect(password, freshUser.password)) return res.status(401).json({status: 'fail', message: 'Incorrect email or password !'})
    const token=jwt.sign(
        { userId: freshUser._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    res.cookie('jwt', token, { httpOnly: true });
    
    return res.status(200)
    .json({
        userId: freshUser._id,
        token: token,
        role: freshUser.role,
        fullName: freshUser.fullName
    });
});


