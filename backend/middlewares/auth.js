
const User = require('../models/userModel'); // User model
const Role = require('../models/roleModel'); // Role model
const seedBD = require('../utils/seedDB');
const jwt=require('jsonwebtoken'); // Encrypting token
const AppError = require('../utils/appError');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');


const verifyJwt = promisify(jwt.verify);

exports.protect = catchAsync(async(req,res ,next)=> {
        if(!req.headers?.authorization?.startsWith('Bearer')) return next(new AppError('you are not logged in, please log in to get access', 401));

        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = await verifyJwt(token, process.env.JWT_SECRET);

        const userId=decodedToken.userId;

        const freshUser = await User.findOne({_id:userId}).populate('role');

        if(!freshUser) return next(new AppError('the user belonging to this token does no longer exist', 401));
        if(freshUser.hasPasswordChangedAfter(decodedToken.iat)) return next(new AppError('user recently changed password, please log in again', 401))
        
        // if the freshUser doesn't have a role we set it to default, save it, and then populate it
        if (!freshUser.role) {
          const role = await Role.findOne({ name: 'default' });
          if(!role) seedBD();

          freshUser.role = role._id;
          freshUser.passwordConfirm = freshUser.password;
          await freshUser.save();

          freshUser.role = role; // populate the role
        }
        
        req.auth = { userId }; 
        req.user = freshUser;

        if(req.body.userId && req.body.userId !== userId || !freshUser || freshUser._id != userId){
            return next(new AppError('you are not logged in, please log in to get access', 401))
        }else {
            next();
        }
    });
