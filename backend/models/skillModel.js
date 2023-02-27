const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');

const skillSchema= mongoose.Schema({
    name:{type: String ,required:true,unique:true},
    level :{type:Number ,default: 0, min: [0, "level must be equal or greater than 0"], max: [5, "level must be equal or less than 5"]},
    Users: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ],

});

skillSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
        name: Joi.string().required(),
		level: Joi.number().min(0).max(5),
        Users: Joi.array().items(Joi.object())
	});
	const validation = schema.validate(obj);
    return validation;
    
}
skillSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Skill',skillSchema);