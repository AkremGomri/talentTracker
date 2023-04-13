const SkillElement = require('../../models/fields and skills/skillElementModel');
const factory = require('../handleFactory');

exports.createFields = factory.Create(SkillElement);
exports.getFields = factory.Read(SkillElement);

exports.updateField = factory.Update(SkillElement);
exports.deleteFields = factory.Delete(SkillElement);