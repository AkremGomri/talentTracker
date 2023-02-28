const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');

const RoleSchema= mongoose.Schema({
    name:{type: String ,required:true,unique:true},
    capabilities: [
        { type: mongoose.Schema.ObjectId, ref: 'Capability' }
    ],
    Users: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ],
});

// RoleSchema.pre('save', function (next) {
//     this.capabilities = _.uniq(this.capabilities);
//     this.Users = _.uniq(this.Users);
//     next();
//   });

RoleSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
        name: Joi.string().required(),
        capabilities: Joi.array().items(Joi.object()),
        Users: Joi.array().items(Joi.object()),
	});
	const validation = schema.validate(obj);
    return validation;
    
}
RoleSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Role',RoleSchema);