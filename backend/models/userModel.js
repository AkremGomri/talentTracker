const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userSchema= mongoose.Schema({
    email:{type: String ,required:true,unique:true},
    password :{type:String ,required:true},
    Photo:{ type: String,default: ''},
    name:{type:String ,required:true},
    lastName:{type:String ,required:true},
    date_of_birth:{type:Date, default: ''},
    city:{type:String , default: ''},
    gender:{type:String, default: ''},
    bio:{type:String, default: 'My Bio'},
    // connected: {type: Boolean,default: false },
    manager: { type: mongoose.Schema.ObjectId, ref: 'User', default: null },

    Manages: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ],
    Skills: [
        { type: mongoose.Schema.ObjectId, ref: 'Skill' }
    ],

    Notifs: [
        {
            senderId: {type: Object ,required:true},
            senderPhoto: { type: String },
            message: {type:String ,required:true,default: ''},
            type: {type:String, required: true, default:'no Type'},
            isnew: {type: Boolean, default: true}, 
            isRead: {type: Boolean, default: false},
            last_modified: {type: Date, default: new Date(), index: true}
        }
    ],
});

// userSchema.methods.joiValidate = function(obj) {
// 	const schema =  Joi.object({
//         email: Joi.string().email().required(),
// 		password: joiPassword
//             .string()
//             .minOfSpecialCharacters(1)
//             .minOfLowercase(1)
//             .minOfUppercase(1)
//             .minOfNumeric(1)
//             // .noWhiteSpaces()
//             .required(),
//         Photo: Joi.string(),
// 		name: Joi.string().required(),
// 		lastName: Joi.string().required(),
// 		date_of_birth: Joi.date(),
//         city:Joi.string(),
//         gender:Joi.string(),
//         bio:Joi.string(),

//         manager: Joi.object(),
//         Manages: Joi.array().items(Joi.object()),
//         skills: Joi.array().items(Joi.object())
// 	});
// 	const validation = schema.validate(obj);
//     return validation;
    
// }
// userSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('User',userSchema);