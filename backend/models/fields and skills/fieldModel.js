const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subFields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubField' }],
})

module.exports = mongoose.model('Field', fieldSchema);
