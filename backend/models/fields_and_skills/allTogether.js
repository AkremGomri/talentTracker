const mongoose = require('mongoose');

const SkillElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // other properties of a SkillElement
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subField: { type: mongoose.Schema.Types.ObjectId, ref: 'SubField', required: true },
  skillElements: [SkillElementSchema]
  // other properties of a Skill
});

const SubFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true }
  // other properties of a SubField
});

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subFields: [SubFieldSchema]
  // other properties of a Field
});

const Skill = mongoose.model('Skill', SkillSchema);
const SubField = mongoose.model('SubField', SubFieldSchema);
const Field = mongoose.model('Field', FieldSchema);

module.exports = Field;