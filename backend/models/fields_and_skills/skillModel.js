const mongoose = require('mongoose');

const skillElementSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    // deleted: { type: Boolean, default: false }
    // parentSkill : { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
});

const skillSchema = mongoose.Schema({
    name:{ type: String ,required:true,unique:true },
    // level :{type:Number ,default: 0, min: [0, "level must be equal or greater than 0"], max: [5, "level must be equal or less than 5"]},
    parentSubField: { type: mongoose.Schema.Types.ObjectId, ref: 'SubField'},
    skillElements: [skillElementSchema],
    description: { type: String, default: "" },
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }

});

skillSchema.pre(/^find/, function () {
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