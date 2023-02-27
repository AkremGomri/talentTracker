const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
// const { Validator } = require('node-input-validator');
const fs = require('fs');

exports.signup = (req, res, next) => {
    console.log("req.body.email: " + req.body.email);
    bcrypt.hash(req.body.password, 10) 
      .then((hash) => {
        me = {
            email: req.body.email,
            password : hash,
            Photo: req.body.Photo,
            name: req.body.name,
            lastName: req.body.lastName,
            date_of_birth: req.body.dateOfBirth,
            city: req.body.city,
            gender: req.body.gender,
            bio: req.body.bio,
          //photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        const user = new User(me);
        // user.joiValidate(me);
        user.save()
          .then(() => {
            res.status(201).json({ message: "utilisateur crée!" })})
          .catch(error => {
            res.status(500).json({ error })
          });
  
      })
  };

exports.login = (req, res, next) => {
    console.log(req.body);
    User.findOne({
      $or: [{
        "email": req.body.email
      }, {
        "pseudo": req.body.email
      }]
    })
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
              res.status(500).json({ error })
            });
        })
      .catch(error => {      
        res.status(500).json({ error })});
  };