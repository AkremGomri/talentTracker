const jwt=require('jsonwebtoken');
const User = require('../models/userModel');

module.exports= async (req,res ,next)=> {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken=jwt.verify(token, process.env.JWT_SECRET);
        const userId=decodedToken.userId;
        // console.log("user idddd: ",userId);
        const user=await User.findOne({_id:userId}).populate('role');
        req.auth = { userId }; 
        req.user=user;
        console.log("userId: ",req.auth.userId);
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