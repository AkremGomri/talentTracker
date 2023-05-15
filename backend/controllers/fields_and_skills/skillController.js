const { default: mongoose } = require('mongoose');
const Skill = require('../../models/fields_and_skills/skillModel');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../handleFactory');
const { fields } = require('../../utils/constants/users_abilities');

exports.createSkills = catchAsync(async (req, res, next) => {
    console.log("************************************************************************************");

    const  modelsToCreate = req.body;
    const myPermissions = factory.getMyPermissions(req, 'skills', next);
    const dataToStore = factory.extractAllowedFields(modelsToCreate, myPermissions);
    
    console.log("modelsToCreate: ",modelsToCreate);
    console.log("myPermissions: ",myPermissions);
    console.log("dataToStore: ",dataToStore);

    const skills = await Skill.insertMany(dataToStore);

    return res.status(201).json({
        status: 'success',
        data: skills
    });

}); // verified

exports.getSkills = catchAsync(async (req, res, next) => {
    const name = req.body.name || req.body.names; // || req.body[`${Skill.collection.name.slice(0, -1)}`];
    const id = req.params.id || req.body.ids || req.body.id || (Object.keys(req.body).length? req.body : null); 

    const filter = name? { name } : id? { _id: id } : {};
    filter.deleted = false;

    const mysubFieldPermit = factory.getMyPermissions(req, 'subfields', next).join(' ');
    const myskillsPermit = factory.getMyPermissions(req, 'skills', next).join(' ');
    const myfieldPermit = factory.getMyPermissions(req, 'fields', next).join(' ');

    const skills = await Skill.find(filter, myskillsPermit).populate({
        path: 'childrenItems',
        select: mysubFieldPermit,
        match: { deleted: { $ne: true } }
      }).populate({
        path: 'childrenItems',
        select: myfieldPermit,
        match: { deleted: { $ne: true } }
      })

    // const skills = factory.Read(req, Skill, myPermissions);
    if (!skills) {
        return next(new AppError('No document found with that ID', 404));
    }
 
    res.status(200).json({
        status: 'success',
        data: skills
    });
}); // verified

exports.updateSkill = catchAsync(async (req, res, next) => {
        console.log("aslema");
        const filter = (req.params.id || req.body.id )? { _id: req.params.id || req.body.id } : { name: req.body.name };
        const updates = req.body;

        if (!filter) {
            return next(new AppError('Nothing provided to update', 404));
        }

        const myPermissions = factory.getMyPermissions(req, 'skills', next);
        const dataToStore = factory.extractAllowedFields(updates, myPermissions);

        const result = await Skill.updateOne(filter, dataToStore);
    
        res.status(200).json({
            status: 'success',
            data: result
        });
        console.log("byebye");
}); // verified

exports.deleteSkills = catchAsync(async (req, res, next) => {
    const ids = req.params.id || (Array.isArray(req.body) ? req.body.every(id => mongoose.isValidObjectId(id))? req.body.map(id => id.toString()) :  null : null);

    const names = req.body.name || req.body;

    const filter = ids ? { _id: { $in: ids } }: { name: { $in: names } };

    const myPermissions = factory.getMyPermissions(req, Skill.collection.name, next).join(' '); //exp: 'name email'
    
    let result;

    if (myPermissions.includes(fields.hardDelete) && req.query.hard || req.body.delete === 'hard') result = await Skill.deleteMany(filter);
    else result = await Skill.updateMany(
        filter,
        { $set: { "deleted": true } }
        );

    if (result.deletedCount === 0 || !result.acknowledged) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200)
        .header('X-Deleted-Count', result.deletedCount)
        .json({
            status: 'success',
            data: result
        });
}); // verified

