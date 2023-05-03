const Role = require('../models/roleModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { fields, permissions } = require('../utils/constants/users_abilities');

exports.createNewRole = catchAsync(async (req, res, next) => {
  const me = req.user;
  const myPermissions = me.role.permissions;
  const data = req.body;
  let newRole;
  let isAuthorized = false;

  if(!data?.name || !data?.permissions){

    return res.status(401).json({
      status: 'fail',
      message: 'Please provide a name and permissions'
    });
  }
  
  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Post?.length > 0){
        newRole = {
          name: data.name,
          permissions: data.permissions,
        };
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to create a new role'
    });
  }
  
  // if(!newRole.name || !newRole.permissions[0] !Object.values(newRole.permissions[0].actions).filter(a => a.length !== 0).length){
  //   return res.status(400).json({
  //     status: 'fail',
  //     message: 'Please provide a name and at least one field in permissions'
  //   });
  // }

  const validationResult = await Role.prototype.joiValidate(newRole);
  if (validationResult.error) {
    return next(new AppError(validationResult.error.details[0].message, 400));
  }

  try{
    newRole = await Role.create(newRole);
  } catch(err){
    return next(new AppError(err, 400));
  }
  
  return res.status(201).json({
      status: 'success',
      data: newRole
  });
});

exports.getRole = catchAsync(async (req, res, next) => {
  const me = req.user;
  const myPermissions = me.role.permissions;
  let isAuthorized = false;

  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Get?.length > 0){
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to get a role'
    });
  }

  const roleId = req.body.name || req.params.id;
  if(!roleId){
    return next(new AppError('Please provide a name or an id', 400));
  }

  let role;
  if (typeof roleId === "string") {
    role = await Role.findOne({ "name": roleId });
  } else {
    role = await Role.findOne({ "_id": roleId });
  }

  if(!role){
    return res.status(404).json({
      status: 'success',
      data: null
      });
  }

  /* get all users with that role */
  const users = await User.find({ "role": role._id });
  role.nbUsers = users.length;
  /********************************/

  return res.status(201).json({
      status: 'success',
      data: role
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const me = req.user;
  const myPermissions = me.role.permissions;
  let isAuthorized = false;

  
  const data = req.body;
  if( (!data.name && !req.params.id) || !data.permissions){
    return next(new AppError('Please provide a name or an id and provide permissions', 400));
  }
  
  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Patch?.length > 0){
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to update a role'
    });
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
  const me = req.user;
  const myPermissions = me.role.permissions;
  let isAuthorized = false;

  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Delete?.length > 0){
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to delete a role'
    });
  }

  const roleId = req.params.id;
  const roleName = req.body.name;
  
  if(!roleId && !roleName){
    return next(new AppError('Please provide a name or an id', 400));
  }

  let result;
  if (roleName) {
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

exports.readAllRolesNames = catchAsync(async (req, res, next) => {
  const me = req.user;
  const myPermissions = me.role.permissions;
  let isAuthorized = false;

  myPermissions.some(p => {
    if (p.subject === permissions.User.name) {
      if(p.actions.Post.includes(fields.role)){
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to get all roles'
    });
  }

  let result = await Role.find({}, {name: 1, _id: 0});
  
  result = result.map(r => r.name);

  return res.status(201).json({
    status: 'success',
    result
  });
});

/*               Many roles                 */
exports.deleteManyRoles = catchAsync(async (req, res, next) => {
  const me = req.user;
  const myPermissions = me.role.permissions;
  let isAuthorized = false;

  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Delete?.length > 0){
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to delete many roles'
    });
  }

  let result;
  if(!req.body){
    return next(new AppError('Please provide roles', 400));
  } else if (typeof req.body[0] === "string") {
    result = await Role.deleteMany({ name: { $in: req.body } });
  } else {
    result = await Role.deleteMany({ _id: {$in: req.body} });
  }
  
  return res.status(201).json({
    status: 'success',
    result
  });
});

/*          Dabatabase easy manipulation            */
exports.createManyRoles = catchAsync(async (req, res, next) => {
  const data  = req.body.roles;
  if(!data){
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
  console.log("here we are: ");
  const me = req.user;
  const myPermissions = me.role.permissions;
  let isAuthorized = false;

  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Delete?.length > 0){
        return isAuthorized = true;
      }
    }
  });

  if(!isAuthorized){
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to get all roles'
    });
  }
  
  myPermissions.some(p => {
    if (p.subject === permissions.Role.name) {
      if(p.actions.Get?.length > 0){
        return isAuthorized = true;
      }
    }
  });

  let roles = await Role.find();
  const users = await User.find();

  roles = roles.map(role => {
    let nbUsers = users.filter(user => user.role?.toString() === role._id.toString()).length;
    role.nbUsers = nbUsers;
    return role;
  })

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
