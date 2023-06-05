const mongoose = require('mongoose');

const skillElementSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    // question: { type: String, default: "" },
    // options: [{ 
    //     answear: { type: String, default: "" }, 
    //     correct: { type: Boolean, default: false} 
    // }],
    parentItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill'},
    deleted: { type: Boolean, default: false },
    // parentItem : { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
});

const skillSchema = mongoose.Schema({
    name:{ type: String ,required:true,unique:true },
    type: { type: String, enum: ['Analytical', 'Creative', 'Soft', 'Managerial', 'Interpersonal', 'Technical'], default: 'Technical'},
    parentItem: { type: mongoose.Schema.Types.ObjectId, ref: 'SubField'},
    childrenItems: [skillElementSchema],
    description: { type: String, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

skillSchema.post('insertMany', async function (docs, next) {
    console.log("docs: ",docs);
    for(const doc of docs){
        let parentItem;
        
        // loop over the childrenItems array
        if(doc.childrenItems){
            for (const childItem of doc.childrenItems) {
                // console.log("*******childItemId: ",childItemId);
                try {
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
            parentItem = await mongoose.model('SubField').findById(doc.parentItem);
            if (!parentItem) {
                continue;
            }
            // console.log("*******parentItem.childrenItems: ",parentItem.childrenItems);
                // the parent item was not found, skip it
            parentItem.childrenItems.push(doc._id);
            // console.log("*******parentItem.childrenItems: ",parentItem.childrenItems);
            await parentItem.save();
        }
    }

    next();
  });

skillSchema.pre(/^find/, function () {
    this.where({ deleted: false });

});


skillSchema.pre(/^.*update.*$/i, function () {
    this.where({ deleted: false });

});

// skillSchema.pre('updateMany', async function(next){
//     const update = this.getUpdate();
  
//     if (update.$set.deleted === true) {
//       try {
//         await update.$set['skillElements.$[].deleted'] ;
//     } catch (e) {
//         console.log("error: ", e);
//       }
//     }
  
//     next();
//   })

module.exports=mongoose.model('Skill',skillSchema);