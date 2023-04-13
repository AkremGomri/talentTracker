const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.Create = Model => catchAsync(async (req, res) => {

    const  modelsToCreate = req.body[`${Model.collection.name}`] || req.body[`${Model.collection.name.slice(0, -1)}`] || req.body;

    const docs = await Model.insertMany(modelsToCreate);
    res.status(201).json({
        status: 'success',
        data: docs
    });
}); // verified

exports.Read = async (req, Model, myPermissions) => {

    const name = req.body.name || req.body.names;
    const id = req.params.id || req.body.ids || req.body.id || (Object.keys(req.body).length? req.body : null);

    const filter = name? { name: name } : id? { _id: id } : {};

    const docs = await Model.find(filter);

    if (!docs) {
        return next(new AppError('No document found with that ID', 404));
    }
 
    return docs;
}; //verified

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
    const ids = req.params.id || req.body.ids || req.body.id || (req.body.every(id => typeof id === 'string')? req.body :  req.body.map(r => r._id));

    const filter = { _id: { $in: ids } };

    const result = await Model.deleteMany(filter);

    if (result.deletedCount === 0) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200)
        .header('X-Deleted-Count', result.deletedCount)
        .json({
            status: 'success',
            data: result
        });
}); // verified

exports.getMyPermissions = (req, subject) => {
    let  method = req.method;
    method = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase(); //transform create or CREATE to Create

    const myPermissions = req.user.permissions.find(p => p.subject === subject)

    return myPermissions.actions[method].join(' ');
}



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
