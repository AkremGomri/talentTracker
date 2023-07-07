const Test = require('../models/testModel');
const User = require('../models/userModel');

const  constants  = require('../utils/constants/users_abilities');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTests = catchAsync(async (req, res, next) => {
    const tests = await Test.find().populate({
        path: 'creator',
        select: 'name email'
    }).populate({
        path: 'AssignedToUsers',
        select: 'name email'
    }).populate({
        path: 'skills',
        populate: {
            path: 'childrenItems',
        },
        strictPopulate: false

    });
    return res.status(200).json({tests});
});

exports.deleteAllTests = catchAsync(async (req, res, next) => {
    const result = await Test.deleteMany({}); // delete all documents in the collection
    return res.status(200).json({message:"deleted successfully", result});
});

exports.getTest = catchAsync(async (req, res, next) => {
    const test = await Test.findById(req.params.id).populate({
        path: 'creator',
        select: 'name email'
    }).populate({
        path: 'AssignedToUsers.user',
        select: 'name email'
    }).populate({
        path: 'skills',
        populate: {
            path: 'childrenItems',
        }
    });
    return res.status(200).json({test});
});

exports.createTest = catchAsync(async (req, res, next) => {
    const data = req.body;
    data.creator = req.auth.userId;
    const test = await Test.create(data);
    return res.status(200).json({test});
});

exports.updateTest = catchAsync(async (req, res, next) => {
    const filter = req.params.id? { "_id": req.params.id } : { "email": req.body.email };
    const updatedTest = await Test.findOneAndUpdate(filter, req.body, {new: true});
    return res.status(200).json({updatedTest});
});

exports.deleteTest = catchAsync(async (req, res, next) => {
    const result = await Test.deleteOne({"_id": req.params.id});
    if(result.deletedCount <= 0) next(new AppError('Test not found', 404));
    return res.status(200).json({message:"deleted successfully", result});
});

exports.deleteTests = catchAsync(async (req, res, next) => {
    const result = await Test.deleteMany({ name: { $in: req.body }}); // [id1, id2, id3]
    if(result.deletedCount <= 0) return next(new AppError('Test not found', 404));
    return res.status(200).json({message:"deleted successfully", result});
});

exports.takeTest = catchAsync(async (req, res, next) => {
    const { test, answears } = req.body;

    const realTest = await Test.findById(test._id);
    if(!realTest) return res.status(404).json({ message: "Test not found" });
    
    const index = realTest.AssignedToUsers.findIndex(user => user.user.toString() === req.auth.userId);
    if( index < 0) return res.status(404).json({ message: "Test not assigned to you" });
    if (realTest.AssignedToUsers[index].status === "completed") return res.status(404).json({ message: "Test already submitted you can not retake this test" })

    const startDate = new Date(test.startDate);
    const startDateInMilliseconds = startDate.getTime();

    durationInMilliseconds = test.duration * 24 * 60 * 60 * 1000;


    if(startDateInMilliseconds > Date.now()) return res.status(404).json({ message: "Test not started yet" });
    if(startDateInMilliseconds + durationInMilliseconds < Date.now()) return res.status(404).json({ message: "Test already ended" });


    const me = await User.findOne({ _id: req.auth.userId});

    answears.forEach(answear => {
        const index = me.skills.findIndex(skill => skill.name === answear.name);
        if(index >= 0) {
            me.skills[index] = { ...me.skills[index]._doc, ...answear};
        } else {
            me.skills.push({ ...answear });
        }
    });

    // me.history.push({ _id: test._id, TakenDate: Date.now(), answears, myCurrentSkills: me.skills });
    realTest.AssignedToUsers[index] = { ...realTest.AssignedToUsers[index]._doc, status: "completed"};
    test.AssignedToUsers = realTest.AssignedToUsers;

    me.passwordConfirm = me.password;
    await Promise.all([me.save(), realTest.save()]);

    return res.status(200).json({ message: "Test submitted successfully",result: test })
})

exports.validateTest = catchAsync(async (req, res, next) => {
    const { test, answears } = req.body;
    
    const realTest = await Test.findById(test._id);
    const employee = test.AssignedToUsers[0].user;

    if(!realTest) return res.status(404).json({ message: "Test not found" });
    
    if(!req.user?.manages.includes(employee._id)) return res.status(404).json({ message: "You are not allowed to, you are not his manager" });

    /* if the manager can not retake it more than once */
    if (test.AssignedToUsers[0].verifiedStatus === "completed") return res.status(404).json({ message: "Test already Verified you can not verify this test" })

    /* if the manager can not verify a test wich either not started yet or allready outdated */
    const startDate = new Date(realTest.startDate);
    const startDateInMilliseconds = startDate.getTime();

    durationInMilliseconds = realTest.duration * 24 * 60 * 60 * 1000;


    if(startDateInMilliseconds > Date.now()) return res.status(404).json({ message: "Test not started yet" });
    if(startDateInMilliseconds + durationInMilliseconds < Date.now()) return res.status(404).json({ message: "Test already ended" });
 /***************************************************************/

    const myEmployee = await User.findOne({ _id: employee._id});

    answears.forEach(answear => {
        const index = myEmployee.skills.findIndex(skill => skill.name === answear.name);
        if(index >= 0) {
            myEmployee.skills[index] = { ...myEmployee.skills[index]._doc, ...answear};
        } else {
            myEmployee.skills.push({ ...answear });
        }
    });

    realTest.AssignedToUsers = realTest.AssignedToUsers.map((user, index) => {
        if(user.user.toString() === employee._id.toString()) {
            test.AssignedToUsers[0].verifiedStatus = "completed";
            return { ...realTest.AssignedToUsers[index]._doc, verifiedStatus: "completed"}
        };
        return user;
    });
    
    myEmployee.history.push({ _id: test._id, ValidatedDate: Date.now(), answears, myCurrentSkills: myEmployee.skills });
    myEmployee.passwordConfirm = myEmployee.password;

    await Promise.all([myEmployee.save(), realTest.save()]);    

    return res.status(200).json({ message: "Test submitted successfully", result: test })
})
