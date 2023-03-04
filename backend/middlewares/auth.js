const jwt=require('jsonwebtoken');
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const seedBD = require('../utils/seedDB');

module.exports= async (req,res ,next)=> {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken=jwt.verify(token, process.env.JWT_SECRET);
        const userId=decodedToken.userId;
        // console.log("user idddd: ",userId);
        const user=await User.findOne({_id:userId}).populate('role');
        // if the user doesn't have a role we set it to default, save it, and then populate it
        if (!user.role) {
          const role = await Role.findOne({ name: 'default' });
          if(!role) seedBD();

          user.role = role._id;
          user.passwordConfirm = user.password;
          await user.save();

          user.role = role; // populate the role
        }

        req.auth = { userId }; 
        req.user=user;
        if(req.body.userId && req.body.userId !== userId || !user || user._id != userId){
            throw 'Invalid user ID';
        }else {
            next();
        }
    } catch (error) {
        console.log("auth middleware error: ",error);
        res.status(401).json({error : "auth error: " + error | 'Requete non authentifiée !'})
    }
};