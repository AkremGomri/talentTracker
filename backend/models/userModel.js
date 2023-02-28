const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const validator = require('validator');

const userSchema= mongoose.Schema({
    email: {type: String ,required:[true, "please write a valid email"] ,unique:true, validate: [validator.isEmail, "please write a valid email"]},
    password : {type:String ,required:[true, "please write a valid password"]},
    role: { type: mongoose.Schema.ObjectId, ref: 'Role', default: null },
    manager: { type: mongoose.Schema.ObjectId, ref: 'User', default: null },
    Manages: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ],
    Skills: [
        { type: mongoose.Schema.ObjectId, ref: 'Skill' }
    ],
});

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