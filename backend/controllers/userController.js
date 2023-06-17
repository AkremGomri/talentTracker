
// const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
// const { Validator } = require('node-input-validator');
const  constants  = require('../utils/constants/users_abilities');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const xlsx = require('xlsx');
const Test = require('../models/testModel');
const roleModel = require('../models/roleModel');
const sendEmailAsync = require('../utils/nodeMailer');

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
  const user = await User.findOne(filter).select('-name');
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
  if(result.deletedCount <= 0) return next(new AppError('User not found', 404));
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

exports.getUsersNames = catchAsync(async (req, res, next) => {
  const users = await User.find({}).select('name.first name.last email');
  if(!users) return next(new AppError('User not found', 404));
  return res.status(200).json({users});
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
  const users = await User.find().select('-name').populate({
    path: 'manager',
    select: 'email'
  }).populate('role jobTitle');
  
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
  let now = new Date();
  console.log("now: ", now);
  const workbook = xlsx.readFile(req.file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const usersData = xlsx.utils.sheet_to_json(worksheet);

  // Create an array to store the promises for save operations
  const savePromises = [];
  for (const userData of usersData) {
    const user = new User(userData);

    if (user.password) {
      user.passwordConfirm = user.password;
    } else {
      user.password = "new";
      user.passwordConfirm = "new";
    }

    let rolePromise;
    if (userData.role) {
      rolePromise = roleModel.findOne({ name: userData.role });
    } else {
      rolePromise = roleModel.findOne({ name: "default" });
    }

    const role = await rolePromise;
    if (role) {
      user.role = role._id;
    }

    let manager;
    if (userData.manager) {
      manager = await User.findOne({ email: userData.manager });
      if (manager) {
        user.manager = manager._id;
      }
    }

    // send an email
    user.isConfirmed = false;
    const emailVerificationtoken = user.createEmailVerificationToken(
      { email: user.email },
      '1d'
    );

    const verificationURL = `${req.protocol}://${req.get(
      'host'
    )}/api/user/verifyEmail/${emailVerificationtoken}`;
    sendEmailAsync({
      email: user.email,
      subject: 'Email verification',
      message: `Thank you for using our service. Please verify your email by clicking on the link below: ${verificationURL}`,
      html: `<h1>Please verify your email by clicking on the link below:</h1> <a href="${verificationURL}">${verificationURL}</a>`,
    }).catch(async (err) => {
      console.log(err);
      user.emailVerificationToken = undefined;
      await User.deleteOne({ email: user.email });
      return console.log(`User ${user.email} deleted because of email-confirmation sending error`);
    });
    // end of send an email

    savePromises.push(user.save());
  }

  try {
    // Execute all the save operations concurrently using Promise.all()
    let savedUsers = await Promise.all(savePromises);

    savedUsers = savedUsers.map(user => {
      user.password = undefined;
      user.passwordConfirm = undefined;
      const userDate = usersData.find(u => u.email === user.email);
      if (userDate.role) {
        user.role = userDate.role;
        console.log("user.role: ", user.role);
      } else {
        user.role = "default";
      }
      if (userDate.manager) {
        user.manager = userDate.manager;
      }
      return user;
    });

    console.log("savedUsers: ", savedUsers);
    const now2 = new Date();
    console.log("now2: ", now2);

    console.log("now2 - now: ", now2 - now);
    return res.status(201).json({
      message: 'Data inserted successfully!',
      data: { users: savedUsers },
      status: 'success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
});


exports.updateMySkills = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.auth.userId);
  if(!user) return next(new AppError('User not found', 404));
  
  const skills = req.body;
  if(!skills) return next(new AppError('Skills not found', 404));

  skills.map(skill => {
    skill.date = Date.now();
    
    var SkillIndex = user.skills.findIndex(function (s) {
      console.log("s.sourceId: " + s.sourceId);
      return s.sourceId?.toString() === skill.sourceId;
    });
    console.log("SkillIndex: " + SkillIndex);
    if (SkillIndex !== -1) {
      // If the skills exists, replace it
      user.skills[SkillIndex] = skill;
    } else {
      // If the skills doesn't exist, push it to the array
      user.skills.push(skill);
    }
  });
  user.passwordConfirm = user.password
  // const skillsArray = skills.map(skill => {
  //   return {
  //     skill: skill,
  //     date: Date.now()
  //   }
  // });
  console.log("user: ",user);

  
  await user.save();

  return res.status(200).json({message:"updated successfully", user});
});

exports.getProfil = catchAsync(async(req, res, next) => {
  const filter = (req.params.id || req.body._id)? { "_id": req.params.id || req.body._id } : req.body.email? { "email": req.body.email } : {};

  let myAssignedTests = await Test.find({ "assignedTo": { $in: req.auth.userId }, "status": { $ne: "completed" } })
    .populate({
      path: 'creator',
      select: 'name email'
    }).populate({
      path: 'AssignedToUsers.user',
      select: 'name email'
    })
    .populate({
      path: 'skills',
      populate: {
          path: 'childrenItems',
      }
    });

    myAssignedTests = myAssignedTests?.filter(test => test.AssignedToUsers = test.AssignedToUsers?.find( a => a.user?._id.toString() === req.auth.userId))

    let MyEmployeesTests = await Test.find({
      "assignedTo": { $in: req.user.manages }, // Assuming the managed employees' IDs are stored in req.auth.manages
      "status": { $ne: "completed" }
    })
    .populate({
      path: 'creator',
      select: 'name email'
    })
    .populate({
      path: 'AssignedToUsers.user',
      select: 'name email'
    })
    .populate({
      path: 'skills',
      populate: {
        path: 'childrenItems',
      }
    });

    // console.log("MyEmployeesTests: ",MyEmployeesTests);

    MyEmployeesTests = MyEmployeesTests.flatMap(test => {
      const filteredUsers = test.AssignedToUsers.filter(a => {
        if (req.user.manages.includes(a.user?._id.toString())) {
          return true;
        }
        return false;
      });
      
      if (filteredUsers.length > 0) {
        return filteredUsers.map(a => {
          return {
            ...test._doc,
            AssignedToUsers: [a],
            type:"toBeValidated"
          };
            });
      } else {
        return [];
      }
    });

    console.log("MyEmployeesTests2: ",MyEmployeesTests);

  let user = await User.find(filter).select('-password -deleted -__v').populate({
    path: 'jobTitle role',
    select: "name description",
    deleted: { $ne: true }
    })
    // .populate({
    //   path: 'skills.skill',
    //   deleted: { $ne: true },
    //   populate: {
    //     path: 'parentItem',         //maybe only this is intresting to get the parent for charts
    //     deleted: { $ne: true }
    //   }
    // })
  
    // console.log("user[0].fullName: ",user[0].fullName);

  user[0] = {
    ...user[0]._doc,
    myAssignedTests,
    MyEmployeesTests
  }
  user[0].fullName = `${user[0].name?.first} ${user[0].name?.last}`

  if(!user) return next(new AppError('User not found', 404));
  return res.status(200).json(user);
});

exports.getMyProfile = catchAsync(async(req, res, next) => {
  console.log("hereeeeeeeeeeeeeeeeeeeee");
  let myAssignedTests = await Test.find({ "assignedTo": { $in: req.auth.userId }, "status": { $ne: "completed" } })
    .populate({
      path: 'creator',
      select: 'name email'
    }).populate({
      path: 'AssignedToUsers.user',
      select: 'name email'
    })
    .populate({
      path: 'skills',
      populate: {
          path: 'childrenItems',
      }
    });

    console.log("myAssignedTests: ",myAssignedTests);
    myAssignedTests = myAssignedTests?.filter(test => test.AssignedToUsers = test.AssignedToUsers?.find( a =>  a.user?._id.toString() === req.auth.userId))
    console.log("naarech");
  

  let user = await User.find({_id: req.auth.userId}).select('-password -deleted -__v').populate({
      path: 'jobTitle role',
      select: "name description",
      deleted: { $ne: true }
    })
    console.log("hene");
    // .populate({
    //   path: 'skills.skill',
    //   deleted: { $ne: true },
    //   populate: {
    //     path: 'parentItem',         //maybe only this is intresting to get the parent for charts
    //     deleted: { $ne: true }
    //   }
    // })
  
    // console.log("user[0].fullName: ",user[0].fullName);

  user[0] = {
    ...user[0]._doc,
    myAssignedTests
  }
  user[0].fullName = `${user[0].name?.first} ${user[0].name?.last}`

  if(!user) return next(new AppError('User not found', 404));
  return res.status(200).json(user);
});
