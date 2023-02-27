const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');

const capabilitySchema= mongoose.Schema({
    name:{type: String ,required:true,unique:true},
    level :{type:Number ,default: 0, min: [0, "level must be equal or greater than 0"], max: [5, "level must be equal or less than 5"]},
});

capabilitySchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
        name: Joi.string().required(),
		level: Joi.number().min(0).max(5),
	});
	const validation = schema.validate(obj);
    return validation;
    
}
capabilitySchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Capability',capabilitySchema);