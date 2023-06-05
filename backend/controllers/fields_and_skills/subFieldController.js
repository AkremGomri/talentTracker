const { default: mongoose } = require('mongoose');
const { fields } = require('../../utils/constants/users_abilities');
const factory = require('../handleFactory');
const catchAsync = require('../../utils/catchAsync');

const SkillCtr = require('../../controllers/fields_and_skills/skillController');
const SubField = require('../../models/fields_and_skills/subFieldModel');
const Field = require('../../models/fields_and_skills/fieldModel');

exports.createSubFields = catchAsync(async (req, res, next) => {
    
    const  modelsToCreate = req.body[`${SubField.collection.name}`] || req.body[`${SubField.collection.name.slice(0, -1)}`] || req.body;
    const myPermissions = factory.getMyPermissions(req, 'subfields', next);
    const dataToStore = factory.extractAllowedFields(modelsToCreate, myPermissions);
    const subFields = await SubField.insertMany(dataToStore);
    res.status(201).json({
        status: 'success',
        data: subFields
    });

}); // verified

exports.getSubFields = catchAsync(async (req, res, next) => {

    const name = req.body.name || req.body.names; // || req.body[`${SubField.collection.name.slice(0, -1)}`];
    const id = req.params.id || req.body.ids || req.body.id || (Object.keys(req.body).length? req.body : null); 

    const filter = name? { name } : id? { _id: id } : {};
    filter.deleted = false;

    const mysubFieldPermit = factory.getMyPermissions(req, 'subfields', next).join(' ');
    const myskillsPermit = factory.getMyPermissions(req, 'skills', next).join(' ');
    const myfieldPermit = factory.getMyPermissions(req, 'fields', next).join(' ');

    const subFields = await SubField.find(filter, mysubFieldPermit).populate({
        path: 'childrenItems',
        select: myskillsPermit,
        match: { deleted: { $ne: true } }
    }).populate({
        path: 'parentItem',
        select: myfieldPermit,
        match: { deleted: { $ne: true } }
      })

    // const subFields = factory.Read(req, SubField, myPermissions);
    if (!subFields) {
        return next(new AppError('No document found with that ID', 404));
    }
 
    res.status(200).json({
        status: 'success',
        data: subFields
    });
}); // verified

exports.updateSubField = catchAsync(async (req, res, next) => {
    console.log("we are hereee");
    const filter = (req.params.id || req.body._id )? { _id: req.params.id || req.body._id } : { name: req.body.name };
    const updates = req.body;
    console.log(filter);
    if (!filter) {
        return next(new AppError('Nothing provided to update', 404));
    }

    const myPermissions = factory.getMyPermissions(req, 'subfields', next);
    const dataToStore = factory.extractAllowedFields(updates, myPermissions);
    console.log(myPermissions);
    console.log(dataToStore);

    const result = await SubField.updateOne(filter, dataToStore);

    res.status(200).json({
        status: 'success',
        data: result
    });
}); // verified

exports.deleteSubFields = catchAsync(async (req, res, next) => {
    const ids = req.params.id || (Array.isArray(req.body) ? req.body.every(id => mongoose.isValidObjectId(id))? req.body.map(id => id.toString()) :  null : null);

    const names = req.body.name || req.body; // Do not use names please, if you use it, it won't remove it from the parent field

    const filter = ids ? { _id: { $in: ids } }: { name: { $in: names } };

    const myPermissions = factory.getMyPermissions(req, SubField.collection.name, next).join(' '); //exp: 'name email'
    
    let result;

    if (myPermissions.includes(fields.hardDelete) && (req.query.hard || req.body.delete === 'hard')) {

        const promise1 = SubField.deleteMany(filter);
        const promise2 = Field.updateMany(
        { childrenItems: { $in: ids } }, // Filter for parent fields containing the deleted subFields
        { $pull: { childrenItems: { $in: ids } } } // Pull the deleted subFields from the parent fields
        );
        const promises = await Promise.all([promise1, promise2]);
        result = promises[0];
      }
    else result = await SubField.updateMany(
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
}); // verified only for deleted set to True


// exports.createFields = factory.Create(SubField);
// exports.getFields = factory.Read(SubField);

// exports.updateField = factory.Update(SubField);
// exports.deleteFields = factory.Delete(SubField);

exports.deleteSubSkills = async function (ids){
    SkillCtr.deleteSkills(ids);
    const result = await SubField.deleteMany({ _id: { $in: ids } });
    return result;
}

exports.deleteAllSubFieldsAsDataBaseAdmin = catchAsync(async (req, res, next) => {
    const result = await SubField.deleteMany();
    res.status(200).json({
        status: 'success',
        data: result
    });
}); //verified