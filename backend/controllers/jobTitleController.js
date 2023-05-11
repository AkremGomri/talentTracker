const catchAsync = require("../utils/catchAsync");
const factory = require('./handleFactory');
const JobTitle = require('../models/jobTitleModel');
const _ = require('lodash');

exports.getJobTitles = catchAsync(async (req, res, next) => {

    let filter = req.params.id;
    console.log("filter now: ",filter);
    if(!filter) filter = _.pick(req.body, ['name', '_id']);
    // const  filter = req.body[`${JobTitle.collection.name}`] || req.body[`${JobTitle.collection.name.slice(0, -1)}`] || req.body;
    const myJobPermit = factory.getMyPermissions(req, JobTitle.collection.name, next);

    console.log("filter: ",filter);
    console.log("myJobPermit: ",myJobPermit);
    const jobTitles = await JobTitle.find(filter, myJobPermit);
    res.status(200).json({
        status: 'success',
        data: jobTitles
    });
}); //verified

exports.createJobTitles = catchAsync(async (req, res, next) => {
    
        const  jobTitlesToCreate = req.body[`${JobTitle.collection.name}`] || req.body[`${JobTitle.collection.name.slice(0, -1)}`] || req.body;
        const myPermissions = factory.getMyPermissions(req, JobTitle.collection.name, next);
    
        const jobTitlesToStore = factory.extractAllowedFields(jobTitlesToCreate, myPermissions);
        const jobTitles = await JobTitle.insertMany(jobTitlesToStore);
        res.status(201).json({
            status: 'success',
            data: jobTitles
        });
    
}); //verified

exports.deleteJobTitles = catchAsync(async (req, res, next) => {
    const ids = req.params.id || (Array.isArray(req.body) ? req.body.every(id => mongoose.isValidObjectId(id))? req.body.map(id => id.toString()) :  null : null);

    const names = req.body.name || req.body;

    const filter = ids ? { _id: { $in: ids } }: { name: { $in: names } };

    const myPermissions = factory.getMyPermissions(req, JobTitle.collection.name, next).join(' '); //exp: 'name email'
    
    let result;

    if (myPermissions.includes('hardDelete') && req.body.delete === 'hard') result = await JobTitle.deleteMany(filter);
    else result = await JobTitle.updateMany(
        filter,
        { $set: { "deleted": true } }
        );

    // if (result.deletedCount === 0 || !result.acknowledged) {
    //     return next(new AppError('No document found with that ID', 404));
    // }

    res.status(200)
        .header('X-Deleted-Count', result.deletedCount)
        .json({
            status: 'success',
            data: result
        });
}); //verified