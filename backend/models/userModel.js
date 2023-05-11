const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const validator = require('validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');

// mongoose schema
const userSchema = mongoose.Schema({
  name: {
    first: { type: String },
    last: { type: String },
  },
  // lastName: { type: String },
  email: {
    type: String,
    required: [true, 'Please write a valid email'],
    unique: true,
    validate: [validator.isEmail, 'Please write a valid email'],
  },
  password: { type: String, required: [true, 'Please write a valid password'] },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  role: { type: mongoose.Schema.ObjectId, ref: 'Role', default: null },
  manager: [{ type: mongoose.Schema.ObjectId, ref: 'User', default: null }],
  manages: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  skills: [{ 
    skill: { type: mongoose.Schema.ObjectId, ref: 'Skill'},
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    levelISet: { 
      type: Number, 
      default: 0, 
      min: 0, max: 5,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      },
    },
    levelMyManagerSet: { 
      type: Number, 
      default: 0, 
      min: 0, max: 5,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      },
      date: { type: Date, default: Date.now },
    }
  }],
  jobTitle: { type: mongoose.Schema.ObjectId, ref: 'JobTitle', default: null },
  about: { type: String },
  profilImage: { type: String, default: 'default.jpg' },
  profilCover: { type: String, default: 'default.jpg' },
  contact: {
    phone_number: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    zip_code: { type: String, default: '', maxlength: 5 },
    website: { type: String, default: '' },
  },
  join_date: { type: Date, default: Date.now()},
  deleted: { type: Boolean, default: false }
});

// userSchema.post(/^find/, function(docs, next){
//   if( Array.isArray(docs)) {
//     docs.forEach(function(doc) {
//       doc.password = undefined;
//     });
//   } else {
//     console.log("hellooooo: ",docs);
//     docs.password = undefined;
//   }
//   console.log("hereeeee");
//   next();
// });

userSchema.virtual('fullName').get(function () {
  return _.startCase(`${this.name.first} ${this.name.last}`);
});

//hashing password
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
    this.passwordConfirm = undefined;
});

// chechk if the password is correct
userSchema.methods.isPasswordCorrect = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// check if the password is changed after the token was issued
userSchema.methods.hasPasswordChangedAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// joi validation
userSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email().required(),
		password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      // .noWhiteSpaces()
      .required(),
    manager: Joi.object(),
    Manages: Joi.array().items(Joi.object()),
    skills: Joi.array().items(Joi.object())
	});
	const validation = schema.validate(obj);
    return validation;
    
}

userSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('User',userSchema);