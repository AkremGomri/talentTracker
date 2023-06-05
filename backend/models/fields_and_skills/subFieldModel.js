const mongoose = require('mongoose');
const FieldModel = require('./fieldModel');

const subFieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    childrenItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
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

// !!!! attention, works only for insertMany
//['save', 'insertMany', /^insert/, /^.*update.*$/i] //attention do not use on save, because it will trigure the onsave function of the parentItem or the children elements
subFieldSchema.post('insertMany', async function (docs, next) {
    for(const doc of docs){
        let childItem;
        let parentItem;
        
        // loop over the childrenItems array
        if(doc.childrenItems){
            for (const childItemId of doc.childrenItems) {
                // console.log("*******childItemId: ",childItemId);
                try {
                // find the child item in the database
                childItem = await mongoose.model('Skill').findById(childItemId);
                if (!childItem) {
                    // the child item was not found, skip it
                    continue;
                }
                // update the parentItem field of the child item
                // console.log("*******childItem.parentItem: ",childItem.parentItem);
                childItem.parentItem = doc._id;
                // console.log("*******childItem.parentItem: ",childItem.parentItem);
                await childItem.save();
                // add doc subfield item to the childrenItems array of the parentItem of the child item    
                } catch (err) {
                console.error(err);
                // continue to the next child item even if there was an error
                continue;
                }
            }
        }
        if(doc.parentItem){
            parentItem = await mongoose.model('Field').findById(doc.parentItem);
            // console.log("*******parentItem.childrenItems: ",parentItem.childrenItems);
                // the parent item was not found, skip it
            parentItem.childrenItems.push(doc._id);
            // console.log("*******parentItem.childrenItems: ",parentItem.childrenItems);
            await parentItem.save();
        }
    }

    next();
  });

subFieldSchema.pre(/^find/, function () {
    this.where({ deleted: false });
});

subFieldSchema.pre('remove', function(next) {
    this.model('Skill').deleteMany({ childrenItems: this._id }, next);
});

module.exports = mongoose.model('SubField', subFieldSchema);