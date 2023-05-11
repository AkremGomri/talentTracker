const mongoose = require('mongoose');

const jobTitleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

jobTitleSchema.pre(/^find/, function () {
    this.where({ deleted: false });
});

jobTitleSchema.pre('remove', function(next) {
    this.model('Skill').deleteMany({ childrenItems: this._id }, next);
});

module.exports = mongoose.model('JobTitle', jobTitleSchema);