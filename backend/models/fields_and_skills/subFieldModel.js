const mongoose = require('mongoose');
const FieldModel = require('./fieldModel');

const subFieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    childrenItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    type: [{ type: String, enum: ['Analytical', 'Creative', 'Soft', 'Managerial', 'Interpersonal', 'Technical'] }],
    description: { type: String, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

// subFieldSchema.post(['save', 'insertMany'], async function(next) {
//     console.log("enterinnnnnng.");
//     const subField = this;
//     try {
//         // Find the parent field document
//         const childrenItems = await mongoose.model('Field').findById(subField.childrenItems);
//         console.log("subField.childrenItems: ",subField.childrenItems);
//         console.log('childrenItems', childrenItems);
//         console.log('subField', subField);

//         if (!childrenItems) {
//             return next();
//         }
//         // Add the new subfield ID to the subFields array
//         childrenItems.subFields.push(subField._id);

//         // Save the parent field document
//         await childrenItems.save();
        
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
    this.model('Skill').deleteMany({ childrenItems: this._id }, next);
});

module.exports = mongoose.model('SubField', subFieldSchema);