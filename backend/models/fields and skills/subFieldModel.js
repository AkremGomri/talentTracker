const mongoose = require('mongoose');

const subFieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentField: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
});

module.exports = mongoose.model('SubField', subFieldSchema);