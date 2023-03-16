const Role = require('../models/roleModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createNewRole = catchAsync(async (req, res, next) => {
  const data = req.body;
  if(!data?.name || !data?.permissions){
    console.log("data missing");
    return next(new AppError('Please provide a name and permissions', 400));
  }
  
  let newRole = {
    name: data.name,
    permissions: data.permissions
  };
  const validationResult = await Role.prototype.joiValidate(newRole);
  if (validationResult.error) {
    console.log("validation error:", validationResult.error);
    return next(new AppError(validationResult.error.details[0].message, 400));
  }

   newRole = await Role.create(newRole);
  
  return res.status(201).json({
      status: 'success',
      data: newRole
  });
});

exports.getRole = catchAsync(async (req, res, next) => {
  const roleId = req.body.name || req.params.id;
  if(!roleId){
    console.log("req.body.name missing and req.params.id missing: ",roleId);
    return next(new AppError('Please provide a name or an id', 400));
  }

  let role;
  if (typeof roleId === "string") {
    role = await Role.findOne({ "name": roleId });
  } else {
    role = await Role.findOne({ "_id": roleId });
  }

  if(!role){
    return next(new AppError(`No role ${role} found`, 404));
  }

  return res.status(201).json({
      status: 'success',
      data: role
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const data = req.body;
  if( (!data.name && !req.params.id) || !data.permissions){
    console.log("data.name and req.params.id missing");
    return next(new AppError('Please provide a name or an id and provide permissions', 400));
  }

  let updates = {
    name: data.name,
    permissions: data.permissions
  };

  if (typeof data.name === "string") {
    updatedRole = await Role.findOneAndUpdate({ "name": data.name }, updates, { new: true });
  } else {
    updatedRole = await Role.findOneAndUpdate({ "_id": req.params.id }, updates, { new: true });
  }
  if (updatedRole === null) {
    throw "role " + data.name + " not found"
  }
  return res.status(201).json({
      status: 'success',
      data: updatedRole
  });
});

exports.deleteRole = catchAsync(async (req, res, next) => {
  const roleId = req.body.name || req.params.id;

  if(!roleId){
    console.log("req.body.name and req.params.id missing");
    return next(new AppError('Please provide a name or an id', 400));
  }

  let result;
  if (typeof req.body.name === "string") {
    result = await Role.deleteOne({ "name": roleId } );
  } else {
    result = await Role.deleteOne({ "_id": roleId });
  }
  if(result.deletedCount === 0){
    next(new AppError('role ' + roleId + ' not found', 404))
    throw "role " + roleId + " not found"
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          result
      }
  });
});

/*          Dabatabase easy manipulation            */
exports.createManyRoles = catchAsync(async (req, res, next) => {
  const data  = req.body.roles;
  if(!data){
    console.log("data missing");
    return next(new AppError('Please provide roles', 400));
  }

  let newRoles;

  newRoles = await Role.insertMany(data);

  return res.status(201).json({
      status: 'success',
      data: {
          newRoles
      }
  });
});

exports.updateManyRoles = catchAsync(async (req, res, next) => {
  const data = req.body.roles;
  if(!data){
    console.log("data missing");
    return next(new AppError('Please provide roles', 400));
  }

  let updatedRoles;
  updatedRoles = await Role.updateMany(data);

  return res.status(201).json({
      status: 'success',
      data: updatedRoles
  });
});

exports.getAllRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.find();
  
  return res.status(201).json({
      status: 'success',
      data: {
          roles
      }
  });
});

exports.deleteAllRoles = catchAsync(async (req, res, next) => {
  let result;
  result = await Role.deleteMany({});
  
  return res.status(201).json({
      status: 'success',
      data: {
          result
      }
  });
});
