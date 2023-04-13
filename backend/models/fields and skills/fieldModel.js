const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subFields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubField' }],
})


const Field = mongoose.model('Field', fieldSchema);
module.exports = Field;
