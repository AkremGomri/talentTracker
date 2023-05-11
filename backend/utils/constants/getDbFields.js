const User = require("../../models/userModel");
const Role = require("../../models/roleModel");
const Field = require("../../models/fields_and_skills/fieldModel");
const SubField = require("../../models/fields_and_skills/subFieldModel");
const Skill = require("../../models/fields_and_skills/skillModel");

const mongoose = require('mongoose')
// const dotenv=require('dotenv').config();;

// const DB = process.env.MONGODB_URL.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
const DB = "mongodb+srv://Akrem:v2r3d6ixEVyMQDb5@talenttracker.ye5awzk.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('DB Connected')
})
.catch(err => {
  console.log(`DB Connection Error: ${err.message}`);
  process.emit('unhandledRejection', new Error('Custom unhandled rejection: cannot connect to mongoDB'));
});

async function getUserFields(){
    const userFields = [];
    try{
        const users = await User.find({});
        users.forEach(function(user) {
            Object.keys(user._doc).map((elem) => {
                // console.log("new field: ", elem);
                if(!userFields.includes(elem) && !["_id", "__v"].includes(elem)){
                    userFields.push(elem);
                }
            });
        // console.log(Object.keys(user._doc));
        });
        console.log("users fields: ", userFields);
    } catch (e) {
        console.log("error: ", e);
    }
}
async function getSkillFields(){
    const skillFields = [];
    try{
        const fields = await Skill.find({});
        fields.forEach(function(skill) {
            Object.keys(skill._doc).map((elem) => {
                // console.log("new skill: ", elem);
                if(!skillFields.includes(elem) && !["_id", "__v"].includes(elem)){
                    skillFields.push(elem);
                }
            });
        // console.log(Object.keys(skill._doc));
        });
        console.log("skills fields: ", skillFields);
    } catch (e) {
        console.log("error: ", e);
    }
}
async function getFieldFields(){
    const fieldFields = [];
    try{
        const fields = await Field.find({});
        fields.forEach(function(field) {
            Object.keys(field._doc).map((elem) => {
                // console.log("new field: ", elem);
                if(!fieldFields.includes(elem) && !["_id", "__v"].includes(elem)){
                    fieldFields.push(elem);
                }
            });
        // console.log(Object.keys(field._doc));
        });
        console.log("fields fields: ", fieldFields);
    } catch (e) {
        console.log("error: ", e);
    }
}
async function getSubFieldFields(){
    const subFieldFields = [];
    try{
        const subFields = await SubField.find({});
        subFields.forEach(function(subField) {
            Object.keys(subField._doc).map((elem) => {
                // console.log("new field: ", elem);
                if(!subFieldFields.includes(elem) && !["_id", "__v"].includes(elem)){
                    subFieldFields.push(elem);
                }
            });
        // console.log(Object.keys(subField._doc));
        });
    } catch (e) {
        console.log("error: ", e);
    }
}

async function getRoleFields(){
    const roleFields = [];
    try{
        const roles = await Role.find({});
        roles.forEach(function(role) {
            Object.keys(role._doc).map((elem) => {
                // console.log("new field: ", elem);
                if(!roleFields.includes(elem) && !["_id", "__v"].includes(elem)){
                    roleFields.push(elem);
                }
            });
        // console.log(Object.keys(role._doc));
        });
        console.log("roles fields: ", roleFields);
    } catch (e) {
        console.log("error: ", e);
    }
}

exports.getUserFields = getUserFields;
exports.getFieldFields = getFieldFields;
exports.getRoleFields = getRoleFields;
exports.getSubFieldFields = getSubFieldFields;
exports.getSkillFields = getSkillFields;

  