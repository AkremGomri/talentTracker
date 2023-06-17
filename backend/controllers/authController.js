const User = require('../models/userModel'); // User model
const Role = require('../models/roleModel'); // Role model
const bcrypt = require('bcrypt'); // Hashing password
const jwt=require('jsonwebtoken'); // Encrypting token
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { default: mongoose } = require('mongoose');
const _ = require('lodash');
const sendEmailAsync = require('../utils/nodeMailer');

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
        myManager = await User.findById(reqUser.manager);
        if(!myManager) return res.status(400).json({ message: "Cannot sign up because the manager is not found" });
        myManager.manages.push(reqUser._id);
        myManager.passwordConfirm = myManager.password;
        await myManager.save();
    }


    const newUser = new User(reqUser);
    newUser.joiValidate(reqUser);

    // send an email
    const emailVerificationtoken = newUser.createEmailVerificationToken({ email: newUser.email}, '1d' );

    const verificationURL = `${req.protocol}://${req.get('host')}/api/user/verifyEmail/${emailVerificationtoken}`;
    sendEmailAsync({
        email: newUser.email,
        subject: 'Email verification',
        message: `Thank you for using our service. Please verify your email by clicking on the link below: ${verificationURL}`,
        html: `<h1>Please verify your email by clicking on the link below:</h1> <a href="${verificationURL}">${verificationURL}</a>`,
    }).catch(async (err) => {
        console.log(err);
        newUser.emailVerificationToken = undefined;
        await User.deleteOne({ email: newUser.email });
        console.log('User ${newUser.email} deleted because of email-confirmation sending error');
    });


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

    if(freshUser?.deleted) return res.status(401).json({status: 'fail', message: 'This account no longer exist !'});
    // if(!freshUser?.isConfirmed) return res.status(401).json({status: 'fail', message: 'please confirm your email !'});

    if (!freshUser || !await freshUser.isPasswordCorrect(password, freshUser.password)) return res.status(401).json({status: 'fail', message: 'Incorrect email or password !'});
    if (!!freshUser.emailVerificationToken) return res.status(401).json({status: 'fail', message: 'please confirm your email first. we have sent you a verification email !'});
    // if(!freshUser.isConfirmed) return res.status(401).json({status: 'fail', message: 'please confirm your email !'});

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

exports.verifyEmail = catchAsync(async (req, res, next) => {
    const { token } = req.params;

    // Find the user with the matching verification token
    const user = await User.findOne({ emailVerificationToken: token }).select('-password');

    if (!user) {
        return res.status(400).json({ message: 'verification token either Invalid or expired' });
    }

    // Update the user's email verification status
    user.isConfirmed = true;
    user.emailVerificationToken = undefined;

    await user.save();

    // Redirect the user to a specific URL
    return res.redirect(process.env.FRONT_END_URL + '/login');

});


