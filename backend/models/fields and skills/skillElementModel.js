const mongoose = require('mongoose');

const skillElementSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentSkill : { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
})

module.exports = mongoose.model('SkillElement', skillElementSchema);