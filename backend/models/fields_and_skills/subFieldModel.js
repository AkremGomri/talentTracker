const mongoose = require('mongoose');
const FieldModel = require('./fieldModel');

const subFieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentField: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    description: { type: String, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

// subFieldSchema.post(['save', 'insertMany'], async function(next) {
//     console.log("enterinnnnnng.");
//     const subField = this;
//     try {
//         // Find the parent field document
//         const parentField = await mongoose.model('Field').findById(subField.parentField);
//         console.log("subField.parentField: ",subField.parentField);
//         console.log('parentField', parentField);
//         console.log('subField', subField);

//         if (!parentField) {
//             return next();
//         }
//         // Add the new subfield ID to the subFields array
//         parentField.subFields.push(subField._id);

//         // Save the parent field document
//         await parentField.save();
        
//         // Call next to continue the save operation
//         console.log("finished");
//         next();
//     } catch (error) {
//         console.log("eroor");
//         next(error);
//     }
// });

subFieldSchema.pre(/^find/, function () {
    this.where({ deleted: false });
});

subFieldSchema.pre('remove', function(next) {
    this.model('Skill').deleteMany({ parentSubField: this._id }, next);
});

module.exports = mongoose.model('SubField', subFieldSchema);