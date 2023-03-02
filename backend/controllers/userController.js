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

    let role;
    if(newUser.role){
      try{
        console.log("newUser.role: " + newUser.role);
        if (typeof newUser.role === "string") {
          role = await roleModel.findOne({ "name": newUser.role });
        } else {
          role = await roleModel.findOne({ "_id": newUser.role });
        }
        console.log("heree: ",newUser);
        newUser.role = role._id;
      } catch(error){
        console.log("error extracting role: ",error);
        return res.status(500).json("wrong data provided !")
      }
    } else {
      console.log("ma3andouch role");
      role = await roleModel.findOne({ name: 'default' })
      console.log("role: ",role);
      newUser.role = role._id;
    }

    console.log("newUser.email: " + newUser.email);

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: newUser.role         
    });
    user.joiValidate(req.body);
    user.save()
      .then(() => {
        return res.status(201).json({ message: "utilisateur crée!" })})
      .catch(error => {
        console.log("error signing up: ",error);
        return res.status(500).json(error)
      });
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
                  process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
              )
              return res.status(200)
              .json({
                userId: user._id,
                token: token
              });
            })
            .catch(error => {
              console.log("error: ", error);
              return res.status(500).json( error )
            });
        })
      .catch(error => {      
        return res.status(500).json( error )});
  };

/*           missing something            */
exports.delete = async (req, res, next) => {
  try{
    let result = await User.deleteOne({"email": req.body.email})
    if(result.deletedCount <= 0) throw "user not found";
    return res.status(200).json({message:"deleted successfully"});
  } catch (error) {
    console.log("error deleting user: ",error);
    return res.status(500).json( error )
  }
}

/*           test            */
exports.test = (req, res, next) => {
  const rolePermissions = req.user;
  console.log("rolePermissions: ",rolePermissions);
  // permissions.every(p => rolePermissions.includes(p));
  return res.status(200).json({message:"successful", rolePermissions});
}

/*          Dabatabase easy manipulation            */
exports.createManyUsers = async (req, res, next) => {
  if(!req.body.users){
    console.log("req.body.users missing");
    return res.status(400).json({ error: "missing field" });
  }

  console.log("req.body.users: " + req.body.users);

  let newUsers;
  try{
    newUsers = await User.insertMany(req.body.users);
  } catch(error){
    console.log("error adding many new user: ",error);
    return res.status(500).json(error)
  }

  return res.status(201).json({
      status: 'success',
      data: {
          newUsers
      }
  });
}

exports.updateManyUsers = async (req, res, next) => {
  if(!req.body.users){
    console.log("req.body.users missing");
    return res.status(400).json({ error: "missing field" });
  }

  console.log("req.body.users: " + req.body.users);

  let updatedUsers;
  try{
    updatedUsers = await User.updateMany(req.body.users);
  } catch(error){
    console.log("error updating many users: ",error);
    return res.status(500).json(error)
  }

  return res.status(201).json({
      status: 'success',
      data: {
          updatedUsers
      }
  });
}

exports.getAllUsers = async (req, res, next) => {
  let users;
  try{
    users = await User.find().populate('role');
  } catch(error){
    console.log("error getting all users: ",error);
    return res.status(500).json(error)
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          users
      }
  });
}

exports.deleteAllUsers = async (req, res, next) => {
  let result;
  try{
    result = await User.deleteMany();
  } catch(error){
    console.log("error deleting many users: ",error);
    return res.status(500).json(error)
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          result
      }
  });
};