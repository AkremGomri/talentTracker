
// const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
// const { Validator } = require('node-input-validator');
const  constants  = require('../utils/constants/users_abilities');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const xlsx = require('xlsx');

/*            me                 */
exports.updateMe = catchAsync(async (req, res, next) => {

  const id = req.auth.userId;
  const user = await User.updateOne({ _id: id }, req.body);
  return res.status(200).json({ message: "updated successfully", user });
});

exports.updateProfilePhoto = catchAsync(async (req, res, next) => {
  console.log("req: ", req);
  console.log("req.file: ", req.file);
  console.log("req.image: ", req.image);
  console.log("req.body: ", req.body);
  // console.log("profilImage: ", req.file.path);
  // const result = await User.updateOne({_id: req.auth.userId}, {profilImage: req.file.path});
  if(result.deletedCount <= 0) next(new AppError('User not found', 404));
  return res.status(200).json({message:"deleted successfully", result});
});

/*           one user            */
exports.getOneUser = catchAsync(async (req, res, next) => {
  const filter = req.params.id? { "_id": req.params.id } : { "email": req.body.email };
  const user = await User.findOne(filter).select('-firstName -lastName').lean({ virtuals: true });
  // console.log("user Name: ", user.fullName);
  // console.log("user Name: ", user.name);
  if(!user) return next(new AppError('User not found', 404));
  return res.status(200).json({user});
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const result = await User.deleteOne({"email": req.body.email});
  if(result.deletedCount <= 0) next(new AppError('User not found', 404));
  return res.status(200).json({message:"deleted successfully", result});
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const result = await User.deleteOne({"_id": req.params.id});
  if(result.deletedCount <= 0) next(new AppError('User not found', 404));
  return res.status(200).json({message:"deleted successfully", result});
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filter = req.params.id? { "_id": req.params.id } : { "email": req.body.email };

  delete req.body._id;
  // delete req.body.email;
  // delete req.body.password;
  const result = await User.updateOne(filter, req.body);
  if(result.deletedCount <= 0) next(new AppError('User not found', 404));
  return res.status(200).json({message:"deleted successfully", result});
});
/*           test            */
exports.test = (req, res, next) => {
  const permissions = req.user.role.permissions;
  permissions.every(p => {
    if(p.actions.includes(constants.Patch)){
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
    return permission.subject === constants.subjects.ROLE && permission.actions.includes(constants.actions.Get);
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
  console.log("lll: ",req.body);
  users = await User.find({ email: { $in: req.body } } ).populate('role');

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


/*          Others            */
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

exports.getProfil = catchAsync(async(req, res, next) => {
  const filter = (req.params.id || req.body._id)? { "_id": req.params.id || req.body._id } : req.body.email? { "email": req.body.email } : {};

  const user = await User.find(filter).select('-password -deleted -__v').populate({
    path: 'jobTitle role',
    select: "name description",
    deleted: { $ne: true }
}).populate({
  path: 'skills.skill',
  deleted: { $ne: true }
}).populate({
  path: 'skills.skill',
  deleted: { $ne: true },
  populate: {
    path: 'parentItem',
    deleted: { $ne: true }
  }
});

  if(!user) return next(new AppError('User not found', 404));
  return res.status(200).json(user);
});
