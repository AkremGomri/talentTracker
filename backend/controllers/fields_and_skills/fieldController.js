const Field = require('../../models/fields_and_skills/fieldModel');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../handleFactory');

exports.createFields = catchAsync(async (req, res, next) => {

    const  modelsToCreate = req.body[`${Field.collection.name}`] || req.body[`${Field.collection.name.slice(0, -1)}`] || req.body;
    const myPermissions = factory.getMyPermissions(req, 'fields', next);

    const dataToStore = factory.extractAllowedFields(modelsToCreate, myPermissions);
    const fields = await Field.insertMany(dataToStore);
    res.status(201).json({
        status: 'success',
        data: fields
    });

}); //verified

exports.getFields = catchAsync(async (req, res, next) => {

    const name = req.body.name || req.body.names; // || req.body[`${Field.collection.name.slice(0, -1)}`];
    const id = req.params.id || req.body.ids || req.body.id || (Object.keys(req.body).length? req.body : null); 

    const filter = name? { name } : id? { _id: id } : {};
    filter.deleted = false;

    const myfieldPermit = factory.getMyPermissions(req, 'fields', next).join(' ');
    const mysubFieldPermit = factory.getMyPermissions(req, 'subfields', next).join(' ');
    const mySkillsPermit = factory.getMyPermissions(req, 'skills', next).join(' ');

    const fields = await Field.find(filter, myfieldPermit).populate({
        path: 'subFields',
        select: mysubFieldPermit,
        populate: {
            path: 'skills',
            select: mySkillsPermit,
            populate: {
                path: 'skillElements',
            }
        }
      });


    // const fields = factory.Read(req, Field, myPermissions);
    if (!fields) {
        return next(new AppError('No document found with that ID', 404));
    }
 
    res.status(200).json({
        status: 'success',
        data: fields
    });
}); //verified

exports.updateField = catchAsync(async (req, res, next) => {
        console.log("hello there");
        const filter = { _id: req.params.id || req.body.id || req.body._id || req.body.name };
        const updates = req.body;

        const myfieldPermit = factory.getMyPermissions(req, 'fields', next);
        // const mysubFieldPermit = factory.getMyPermissions(req, 'subfields', next).join(' ');
        // const mySkillsPermit = factory.getMyPermissions(req, 'skills', next).join(' ');
        
        const modifications = factory.extractAllowedFields(updates, myfieldPermit);

        if (!filter) {
            return next(new AppError('Nothing provided to update', 404));
        }
    
        console.log("modifications: ",modifications);
        console.log("filter: ",filter);

        const result = await Field.updateOne(filter, modifications);
        console.log("result: ",result);
        res.status(200).json({
            status: 'success',
            data: result
        });
}); //verified

exports.deleteFields = catchAsync(async (req, res, next) => {
    const ids = req.params.id || (Array.isArray(req.body) ? req.body.every(id => mongoose.isValidObjectId(id))? req.body.map(id => id.toString()) :  null : null);

    const names = req.body.name || req.body;

    const filter = ids ? { _id: { $in: ids } }: { name: { $in: names } };

    const myPermissions = factory.getMyPermissions(req, Field.collection.name, next).join(' '); //exp: 'name email'
    
    let result;

    if (!myPermissions.includes('hardDelete') && req.body.delete === 'hard') result = await Field.deleteMany(filter);
    else result = await Field.updateMany(
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
}); //verified

// exports.deleteOneField = catchAsync(async (req, res, next) => {
//     let deleted;

//     if(!req.params.id && !req.body.name){
//         return next(new AppError('No ID in params nor name in the body provided', 400));
//     }
//     if(req.params.id){
//         deleted = await Field.findByIdAndDelete(req.params.id);
//     }
//     if (!deleted && req.body.name){
//         deleted = await Field.deleteOne({name: req.body.name});
//     }
//     if(deleted.deletedCount === 0){
//         return next(new AppError('No document found with that ID or name', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: deleted
//     });
// });

// exports.updateField = catchAsync(async (req, res, next) => {