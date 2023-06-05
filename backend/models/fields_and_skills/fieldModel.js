const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    childrenItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubField' }],
    description: { type: String, required: false, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

fieldSchema.post('insertMany', async function (docs, next) {
    for(const doc of docs){
        let childItem;
        let parentItem;
        
        // loop over the childrenItems array
        if(doc.childrenItems){
            for (const childItemId of doc.childrenItems) {
                // console.log("*******childItemId: ",childItemId);
                try {
                // find the child item in the database
                childItem = await mongoose.model('SubField').findById(childItemId);
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
    }

    next();
  });

fieldSchema.pre(/^find/, function () {
    this.where({ deleted: false });
});

// fieldSchema.pre('deleteMany', async function (next) {
//   // Retrieve the conditions used for the deleteMany operation
//   const conditions = this.getFilter();
//     console.log("conditions: ",conditions);
//   try {
//     // Perform pre-deletion operations
//     // For example, delete associated child items
//     await ChildItem.deleteMany({ field: conditions._id });

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Field = mongoose.model('Field', fieldSchema);
module.exports = Field;
