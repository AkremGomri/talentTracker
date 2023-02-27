const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');

const RoleSchema= mongoose.Schema({
    name:{type: String ,required:true,unique:true},
    level :{type:Number ,default: 0, min: [0, "level must be equal or greater than 0"], max: [5, "level must be equal or less than 5"]},
    capabilities: [
        { type: mongoose.Schema.ObjectId, ref: 'Capability' }
    ],
    Users: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ],
});

RoleSchema.pre('save', function (next) {
    this.capabilities = _.uniq(this.capabilities);
    this.Users = _.uniq(this.Users);
    next();
  });

RoleSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
        name: Joi.string().required(),
		level: Joi.number().min(0).max(5),
        capabilities: Joi.array().items(Joi.object()),
        Users: Joi.array().items(Joi.object()),
	});
	const validation = schema.validate(obj);
    return validation;
    
}
RoleSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Role',RoleSchema);