const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const jwt=require('jsonwebtoken'); // Encrypting token
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const validator = require('validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const skillElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill'},
  levelISet: { type: Number, default: 0, min: 0, max: 5, null: false },
  levelMyManagerSet: { type: Number, default: 0, min: 0, max: 5, null: false },
  date: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

const skillSchema = mongoose.Schema({
  sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill'},
  name: { type: String ,required:true },
  type: { type: String, enum: ['Analytical', 'Creative', 'Soft', 'Managerial', 'Interpersonal', 'Technical'], default: 'Technical'},
  parentItem: { type: mongoose.Schema.Types.ObjectId, ref: 'SubField'},
  levelISet: { type: Number, default: 0, min: 0, max: 5, null: false },
  levelMyManagerSet: { type: Number, default: 0, min: 0, max: 5, null: false },
  childrenItems: [skillElementSchema],
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

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
    required: [false, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  role: { type: mongoose.Schema.ObjectId, ref: 'Role', default: null },
  manager: { type: mongoose.Schema.ObjectId, ref: 'User', default: null },
  manages: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  skills: [skillSchema],
  jobTitle: { type: mongoose.Schema.ObjectId, ref: 'JobTitle', default: null },
  designation: { type: String },
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
  history: [{
    _id: { type: mongoose.Schema.ObjectId, ref: 'Test', default: null },
    TakenDate: { type: Date },
    ValidatedDate: { type: Date },
    answears: Array,
    myCurrentSkills: Array,
  }],
  isConfirmed: { type: Boolean, default: false },
  emailVerificationToken: String,
  deleted: { type: Boolean, default: false }
}, {
  toJSON:{virtuals:true}, // in options object we can pass virtuals:true to get virtual properties in json
  toObject:{virtuals:true},
});

userSchema.virtual('fullName').get(function () {
  return `${this.name.first} ${this.name.last}`;
});


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

userSchema.methods.createEmailVerificationToken = function(data, expiresIn = process.env.JWT_EXPIRES_IN) {
    const verificationToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
    console.log("this.emailVerificationToken", this.emailVerificationToken);
    this.emailVerificationToken = verificationToken;
    console.log("this.emailVerificationToken", this.emailVerificationToken);
    return verificationToken;
};
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    this.passwordResetToken = resetToken;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
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