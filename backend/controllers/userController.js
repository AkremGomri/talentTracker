const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
// const { Validator } = require('node-input-validator');
const fs = require('fs');
const roleModel = require('../models/roleModel');

exports.signup = async(req, res, next) => {
  let newUser = {...req.body};
    if(!newUser.password || !newUser.email){
      console.log("field missing");
      return res.status(400).json({ error: "missing fields" });
    }

    if(newUser.role){
      try{
        console.log("newUser.role: " + newUser.role);
        let role;
        if (typeof newUser.role === "string") {
          role = await roleModel.findOne({ "name": newUser.role });
        } else {
          role = await roleModel.findOne({ "_id": newUser.role });
        }
        console.log("heree: ",newUser);
        newUser.role = role._id;
      } catch(error){
        console.log("error extracting role: ",error);
        return res.status(500).json(error)
      }
    }

    console.log("newUser.email: " + newUser.email);

    bcrypt.hash(newUser.password, 10) 
      .then((hash) => {
        me = {
            email: newUser.email,
            password : hash,
          //photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        console.log("here we go");
        const user = new User(me);
        user.joiValidate(me);
        user.save()
          .then(() => {
            return res.status(201).json({ message: "utilisateur crée!" })})
          .catch(error => {
            console.log("error signing up: ",error);
            return res.status(500).json(error)
          });
  
      })
  };

exports.login = (req, res, next) => {
    console.log(req.body);
    User.findOne({"email": req.body.email})
      .then(
        user => {
          if (!user) {
            console.log("mal9inech user ", req.body.email);
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          }
          bcrypt.compare(req.body.password, user.password)
            .then(valid => {
              if (!valid) {
                console.log("invalid");
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
              }
              const token=jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
              res.status(200)
              .json({
                userId: user._id,
                token: token
              });
            })
            .catch(error => {
              console.log("error");
              res.status(500).json( error )
            });
        })
      .catch(error => {      
        res.status(500).json( error )});
  };

/*           missing something            */
exports.delete = async (req, res, next) => {
  try{
    let result = await User.deleteOne({"email": req.body.email})
    if(result.deletedCount <= 0) throw "user not found";
    res.status(200).json({message:"deleted successfully"});
  } catch (error) {
    console.log("error deleting user: ",error);
    res.status(500).json( error )
  }
}

/*           test            */
exports.test = (req, res, next) => {
  res.status(200).json({message:"successful"});
}