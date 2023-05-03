const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subFields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubField' }],
    description: { type: String, required: false, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

fieldSchema.pre(/^find/, function () {
    this.where({ deleted: false });
});

const Field = mongoose.model('Field', fieldSchema);
module.exports = Field;
