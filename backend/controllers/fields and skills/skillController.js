const Skill = require('../../models/fields and skills/skillModel');
const factory = require('../handleFactory');

exports.createFields = factory.Create(Skill);
exports.getFields = factory.Read(Skill);

exports.updateField = factory.Update(Skill);
exports.deleteFields = factory.Delete(Skill);