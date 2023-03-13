const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema= mongoose.Schema({
    email: {type: String, required:[true, "please write a valid email"] ,unique:true, validate: [validator.isEmail, "please write a valid email"]},
    password : {type:String ,required:[true, "please write a valid password"]},
    passwordConfirm: {
        type:String ,required:[true, "please confirm your password"],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
            }
    },
    passwordChangedAt: Date,
    role: { type: mongoose.Schema.ObjectId, ref: 'Role', default: null },
    manager: { type: mongoose.Schema.ObjectId, ref: 'User', default: null },
    Manages: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    Skills: [{ type: mongoose.Schema.ObjectId, ref: 'Skill' }],
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
    this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasPasswordChangedAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
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
/* chatGPT solution to make sure that the user has at least one role */
// userSchema.path('role').validate(function(value) {
//     return value.length >= 1;
//   }, 'User must have at least one role.');

userSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('User',userSchema);