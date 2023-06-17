const mongoose = require('mongoose');
const User = require('./userModel');

const testSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    s: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    AssignedToUsers: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'started', 'completed', 'outdated'], default: 'pending' },
        verifiedStatus: { type: String, enum: ['pending', 'started', 'completed', 'outdated'], default: 'pending' },
    }],
    description: { type: String, required: false, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }
});

testSchema.pre("save", async function (next) {
    const nbUsers = await Promise.all(
        this.AssignedToUsers.map(async (curr) => {
            const user = await User.findById(curr);
            if (user) return 1;
            else return 0;
        })
    );

    this.nbUsers = nbUsers.reduce((acc, curr) => acc + curr, 0);
    next();
});


// testSchema.pre(/^insert*/, function () {
//     this.where({ deleted: false });
// });

// testSchema.post('insertMany', async function (docs, next) {
//     for(const doc of docs){
//         let childItem;
//         let parentItem;
        
//         // loop over the childrenItems array
//         if(doc.childrenItems){
//             for (const childItemId of doc.childrenItems) {
//                 // console.log("*******childItemId: ",childItemId);
//                 try {
//                 // find the child item in the database
//                 childItem = await mongoose.model('SubField').findById(childItemId);
//                 if (!childItem) {
//                     // the child item was not found, skip it
//                     continue;
//                 }
//                 // update the parentItem field of the child item
//                 // console.log("*******childItem.parentItem: ",childItem.parentItem);
//                 childItem.parentItem = doc._id;
//                 // console.log("*******childItem.parentItem: ",childItem.parentItem);
//                 await childItem.save();
//                 // add doc subfield item to the childrenItems array of the parentItem of the child item    
//                 } catch (err) {
//                 console.error(err);
//                 // continue to the next child item even if there was an error
//                 continue;
//                 }
//             }
//         }
//     }

//     next();
//   }
// );

// testSchema.pre(/^find/, function () {
//     this.where({ deleted: false });
// });

const Test = mongoose.model('Test', testSchema);
module.exports = Test;