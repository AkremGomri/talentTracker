const SubField = require('../../models/fields and skills/subFieldModel');
const factory = require('../handleFactory');

exports.createFields = factory.Create(SubField);
exports.getFields = factory.Read(SubField);

exports.updateField = factory.Update(SubField);
exports.deleteFields = factory.Delete(SubField);