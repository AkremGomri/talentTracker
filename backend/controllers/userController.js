
// const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
// const { Validator } = require('node-input-validator');
const  constants  = require('../utils/constants/users_abilities');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const xlsx = require('xlsx');

/*           one user            */
exports.delete = catchAsync(async (req, res, next) => {
  const result = await User.deleteOne({"email": req.body.email})
  if(result.deletedCount <= 0) next(new AppError('User not found', 404));
  return res.status(200).json({message:"deleted successfully", result});
});

/*           test            */
exports.test = (req, res, next) => {
  const permissions = req.user.role.permissions;
  console.log("permissions: ",permissions);
  permissions.every(p => {
    if(p.actions.includes(constants.UPDATE)){
      console.log("p: ",p);
    } else {
      console.log("not included ",p);
    }
    
  });
  return res.status(200).json({message:"successful", permissions});
}

exports.testWithRole = (req, res, next) => {
  const userRole = req.user.role;

  const userPermissions = userRole.permissions;
  
  // const addRoleCapability = constants.ADD_USER;

  const hasAddRoleCapability = userPermissions.some((permission) => {
    console.log("known that required subject is: ", constants.subjects.ROLE, " and required action is: ", constants.actions.CREATE);
    console.log(permission.subject === constants.subjects.ROLE && permission.actions.includes(constants.actions.CREATE));
    return permission.subject === constants.subjects.ROLE && permission.actions.includes(constants.actions.CREATE);
    // return permission.actions.includes(addRoleCapability);
  });

  if (!hasAddRoleCapability) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Rest of the code goes here if the user has the "add user" capability

  return res.status(200).json({ message: "successful", userPermissions });
};

/*          Many users            */
exports.createManyUsers = catchAsync(async (req, res, next) => {
  if(!req.body){
    console.log("req.body.users missing");
    return next(new AppError('missing field', 400));
  }

  let newUsers;
  newUsers = await User.insertMany(req.body);

  return res.status(201).json({
      status: 'success',
      data: {
          newUsers
      }
  });
});

exports.updateManyUsers = catchAsync(async (req, res, next) => {
  if(!req.body.users){
    console.log("req.body.users missing");
    return next(new AppError('missing field', 400));
  }

  let updatedUsers;
  updatedUsers = await User.updateMany(req.body.users);

  return res.status(201).json({
      status: 'success',
      data: {
          updatedUsers
      }
  });
});

exports.getManyUsers = catchAsync(async (req, res, next) => {
  let users;

  users = await User.find({ emails: { $elemMatch: { email: { $in: req.body } } } }).populate('role');

  return res.status(201).json({
      status: 'success',
      data: {
          users
      }
  });
});

exports.deleteManyUsers = catchAsync(async (req, res, next) => {
  let result;
  result = await User.deleteMany({ email: { $in: req.body }});
  console.log("result: ",result);
    // await User.deleteMany({ email: { $in: req.body.emails } });
  
  return res.status(201).json({
      status: 'success',
      result
  });
});

/* All users */

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().populate('role');
  
  return res.status(201).json({
      status: 'success',
      data: {
          users
      }
  });
});

exports.deleteAllUsers = async (req, res, next) => {
  const result = await User.deleteMany();
  
  return res.status(201).json({
      status: 'success',
      data: {
          result
      }
  });
};


/*          Excel            */
exports.ExcelSaveUsers = catchAsync(async (req, res, next) => {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const usersData = xlsx.utils.sheet_to_json(worksheet);
    User.insertMany(usersData, (error, docs) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else {
        res.status(201).json({ message: 'Data inserted successfully!' });
      }
    });
});