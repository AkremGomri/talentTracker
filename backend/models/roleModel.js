const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const constants = require('../utils/constants/users_abilities');

const RoleSchema= mongoose.Schema({
    name:{type: String ,required:true,unique:true},
    permissions: [{ type: Object, required:true}],
    // isDeleted: { type: Boolean, default: false },
    // deletedAt: { type: Date, default: null },
  });

  const permissionSchema = Joi.object({
    subject: Joi.string().valid(...Object.values(constants.subjects)).required(),
    actions: Joi.array().items(Joi.string().valid(...Object.values(constants.actions))).required(),
  });

  RoleSchema.methods.joiValidate = function (obj) {
    const schema = Joi.object({
      name: Joi.string().required(),
      permissions: Joi.array().items(permissionSchema).required(),
      deleted: Joi.boolean().default(false),
    });
    return schema.validate(obj);
  };

RoleSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Role',RoleSchema);