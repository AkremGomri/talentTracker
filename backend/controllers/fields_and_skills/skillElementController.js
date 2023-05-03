const SkillElement = require('../../models/fields_and_skills/skillElementModel');
const factory = require('../handleFactory');

// exports.createSkills = catchAsync(async (req, res, next) => {

//     const  modelsToCreate = req.body[`${Skill.collection.name}`] || req.body[`${Skill.collection.name.slice(0, -1)}`] || req.body;
//     const myPermissions = factory.getMyPermissions(req, 'skills', next);
//     const dataToStore = factory.extractAllowedFields(modelsToCreate, myPermissions);
//     const skills = await Skill.insertMany(dataToStore);
//     res.status(201).json({
//         status: 'success',
//         data: skills
//     });

// }); // 

// exports.getSkills = catchAsync(async (req, res, next) => {

//     const name = req.body.name || req.body.names; // || req.body[`${Skill.collection.name.slice(0, -1)}`];
//     const id = req.params.id || req.body.ids || req.body.id || (Object.keys(req.body).length? req.body : null); 

//     const filter = name? { name } : id? { _id: id } : {};
//     filter.deleted = false;

//     const mysubFieldPermit = factory.getMyPermissions(req, 'subfields', next).join(' ');
//     const myskillsPermit = factory.getMyPermissions(req, 'skills', next).join(' ');
//     const myfieldPermit = factory.getMyPermissions(req, 'fields', next).join(' ');

//     const skills = await Skill.find(filter, myskillsPermit).populate({
//         path: 'parentSubField',
//         select: mysubFieldPermit
//       }).populate({
//         path: 'skillElements',
//         select: myfieldPermit
//       })


//     // const skills = factory.Read(req, Skill, myPermissions);
//     if (!skills) {
//         return next(new AppError('No document found with that ID', 404));
//     }
 
//     res.status(200).json({
//         status: 'success',
//         data: skills
//     });
// }); // 

// exports.updateSkill = catchAsync(async (req, res, next) => {
//         console.log("aslema");
//         const filter = (req.params.id || req.body.id )? { _id: req.params.id || req.body.id } : { name: req.body.name };
//         const updates = req.body;

//         if (!filter) {
//             return next(new AppError('Nothing provided to update', 404));
//         }

//         const myPermissions = factory.getMyPermissions(req, 'skills', next);
//         const dataToStore = factory.extractAllowedFields(updates, myPermissions);

//         console.log("filter: ", filter);
//         console.log("dataToStore: ", dataToStore);

//         const result = await Skill.updateOne(filter, dataToStore);
    
//         res.status(200).json({
//             status: 'success',
//             data: result
//         });
//         console.log("byebye");
// }); // 

// exports.deleteSkills = catchAsync(async (req, res, next) => {
//     const ids = req.params.id || (Array.isArray(req.body) ? req.body.every(id => mongoose.isValidObjectId(id))? req.body.map(id => id.toString()) :  null : null);

//     const names = req.body.name || req.body;

//     const filter = ids ? { _id: { $in: ids } }: { name: { $in: names } };

//     const myPermissions = factory.getMyPermissions(req, Skill.collection.name, next).join(' '); //exp: 'name email'
    
//     let result;

//     if (!myPermissions.includes('hardDelete') && req.body.delete === 'hard') result = await Skill.deleteMany(filter);
//     else result = await Skill.updateMany(
//         filter,
//         { $set: { "deleted": true } }
//         );

//     if (result.deletedCount === 0 || !result.acknowledged) {
//         return next(new AppError('No document found with that ID', 404));
//     }

//     res.status(200)
//         .header('X-Deleted-Count', result.deletedCount)
//         .json({
//             status: 'success',
//             data: result
//         });
// }); // 