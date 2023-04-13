const Field = require('../../models/fields and skills/fieldModel');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../handleFactory');

exports.createFields = factory.Create(Field);
exports.getFields = catchAsync(async (req, res) => {

    const myPermissions = factory.getMyPermissions(req, 'Field');

    const fields = factory.Read(req, Field, myPermissions);

    res.status(200).json({
        status: 'success',
        data: fields
    });
});

exports.updateField = factory.Update(Field);
exports.deleteFields = factory.Delete(Field);

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