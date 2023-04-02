const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const constants = require('../utils/constants/users_abilities');

const RoleSchema= mongoose.Schema({
  name:{type: String ,required:true,unique:true},
  permissions: [{ type: Object, required:true}],
  nbUsers: { type: Number, default: 0 }, //still never set correctly
  updatedAt: Date,
  // isDeleted: { type: Boolean, default: false },
  // deletedAt: { type: Date, default: null },
});


RoleSchema.pre(['save', 'create', 'update'], function(next) {
  this.updatedAt = new Date();
  next();
});

const permissionSchema = Joi.object({
  subject: Joi.string().valid(
    ...Object.entries(constants.permissions).map(([key, value]) => {
      return value.name;
    })
  ).required(),
  actions: Joi.object().pattern(
      Joi.string().valid(...Object.values(constants.actions)).required(),
      Joi.array().items(
        Joi.string().valid(
          ...Object.entries(constants.permissions).map(([key, value]) => {
            return value.fields;
          }).flat(Infinity)
        ).required()
      ).required()
    )
    // actions: Joi.array().items(Joi.string().valid(...Object.values(constants.actions))).required(),
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