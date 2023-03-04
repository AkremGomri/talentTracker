const Joi = require('joi');
const constants = require('./constants/users_abilities');

const permissionSchema = Joi.object({
  subject: Joi.string().required(),
  actions: Joi.array().items(Joi.string().valid(...Object.values(constants))).required(),
});

const roleSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().items(permissionSchema).required(),
});

module.exports = async (data) => {
  const validation = await roleSchema.validateAsync(data);
  return validation;
};