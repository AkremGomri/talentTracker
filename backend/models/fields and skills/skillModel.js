const mongoose=require('mongoose');

const skillElementSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    // parentSkill : { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
})

const skillSchema= mongoose.Schema({
    name:{ type: String ,required:true,unique:true },
    // level :{type:Number ,default: 0, min: [0, "level must be equal or greater than 0"], max: [5, "level must be equal or less than 5"]},
    parentSubField: { type: mongoose.Schema.Types.ObjectId, ref: 'SubField', required: true },
    skillElements: [skillElementSchema],
    nbUsers: {type: Number, default: 0},
    deleted: { type: Boolean, default: false }

});

module.exports=mongoose.model('Skill',skillSchema);