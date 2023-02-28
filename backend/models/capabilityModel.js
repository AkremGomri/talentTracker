/*      FOR DELETION    */


// const mongoose=require('mongoose');
// const uniqueValidator=require('mongoose-unique-validator');
// const Joi = require('joi');

// const capabilitySchema= mongoose.Schema({
//     name:{type: String ,required:true,unique:true},
// });

// capabilitySchema.methods.joiValidate = function(obj) {
// 	const schema =  Joi.object({
//         name: Joi.string().required(),
// 	});
// 	const validation = schema.validate(obj);
//     return validation;
    
// }
// capabilitySchema.plugin(uniqueValidator); 

// module.exports=mongoose.model('Capability',capabilitySchema);
