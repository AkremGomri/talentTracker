const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');

const RoleSchema= mongoose.Schema({
    name:{type: String ,required:true,unique:true},
    abilities: 
        { type: Object, required:true}
});

// RoleSchema.pre('save', function (next) {
//     this.abilities = _.uniq(this.abilities);
//     this.Users = _.uniq(this.Users);
//     next();
//   });

RoleSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
        name: Joi.string().required(),
        abilities: Joi.array().items(Joi.object()),
	});
	const validation = schema.validate(obj);
    return validation;
    
}
RoleSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Role',RoleSchema);