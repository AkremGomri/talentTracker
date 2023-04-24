const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const _ = require('lodash');
const mongoose = require('mongoose');

exports.Create = Model => catchAsync(async (req, res, next) => {
    const  modelsToCreate = req.body[`${Model.collection.name}`] || req.body[`${Model.collection.name.slice(0, -1)}`] || req.body;

    const myPermissions = getMyPermissions(req, Model.collection.name, next); //exp: 'name email'
    const dataToStore = extractAllowedFields(modelsToCreate, myPermissions);
    const docs = await Model.insertMany(dataToStore);
    res.status(201).json({
        status: 'success',
        data: docs
    });
}); // verified

exports.Read = (Model, populateObj) => catchAsync(async (req, res, next) => {

    const name = req.body.name || req.body.names; // || req.body[`${Model.collection.name.slice(0, -1)}`];
    const id = req.params.id || req.body.ids || req.body.id || (Object.keys(req.body).length? req.body : null); 

    const filter = name? { name } : id? { _id: id } : {};

    const myPermissions = getMyPermissions(req, Model.collection.name, next).join(' '); //exp: 'name email'

    // const allowedFields = extractAllowedFields(filter, myPermissions);
    const docs = await Model.find(filter, myPermissions).populate(populateObj);

    if (!docs) {
        return next(new AppError('No document found with that ID', 404));
    }
 
    res.status(200).json({
        status: 'success',
        data: docs
    });
}); // verified

exports.Update = Model => catchAsync(async (req, res, next) => {

    const filter = { id: req.params.id || req.body.id };
    const updates = req.body;
    
    if (!filter) {
        return next(new AppError('Nothing provided to update', 404));
    }

    const result = await Model.update(filter, updates);

    res.status(200).json({
        status: 'success',
        data: result
    });
});

exports.Delete = Model => catchAsync(async (req, res, next) => {
    const ids = req.params.id || (Array.isArray(req.body) ? req.body.every(id => mongoose.isValidObjectId(id))? req.body.map(id => id.toString()) :  null : null);

    const names = req.body.name || req.body;

    const filter = ids ? { _id: { $in: ids } }: { name: { $in: names } };

    const myPermissions = getMyPermissions(req, Model.collection.name, next).join(' '); //exp: 'name email'
    
    let result;

    if (!myPermissions.includes('hardDelete') && req.body.delete === 'hard') result = await Model.deleteMany(filter)
    else result = await Model.updateMany(
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


function extractAllowedFields (data, allowedFields) { // this function extracts the allowed fields from the data object. It can be used to extract the allowed fields from a single object or an array of objects.
    if(Array.isArray(data)) return data.map(f => _.pick(f, allowedFields));
    else if(typeof data === 'object')  return _.pick(data, allowedFields);
    else return AppError('Invalid data type', 400);
};

function getMyPermissions (req, subject, next) { // this function extracts the users permissions related to a specific subject and a specific action. For example: ['name', 'permissions'] of the 'fields' subject and 'Get' action.
    const  method = req.method[0].charAt(0).toUpperCase() + req.method.slice(1).toLowerCase();

    const myPermissions = req.user.role.permissions.find(p => {
        return p.subject === subject
    })

    if(!myPermissions){
        return next(new AppError('You do not have permission to access this resource', 403));
    }

    return myPermissions.actions[method];
};

// exports.updateOne = Model => catchAsync(async (req, res, next) => {
//     const me = req.user;
//     const myPermissions = me.role.permissions;
//     let isAuthorized = false;
  
    
//     const data = req.body;
//     if( (!data.name && !req.params.id) || !data.permissions){
//       console.log("data.name and req.params.id missing");
//       return next(new AppError('Please provide a name or an id and provide permissions', 400));
//     }
  
//     let updates = {
//       name: data.name,
//       permissions: data.permissions
//     };
  
//     if (typeof data.name === "string") {
//       updatedRole = await Role.findOneAndUpdate({ "name": data.name }, updates, { new: true });
//     } else {
//       updatedRole = await Role.findOneAndUpdate({ "_id": req.params.id }, updates, { new: true });
//     }
//     if (updatedRole === null) {
//       throw "role " + data.name + " not found"
//     }
//     return res.status(201).json({
//         status: 'success',
//         data: updatedRole
//     });
//   });
