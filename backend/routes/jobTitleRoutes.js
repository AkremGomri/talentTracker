const express = require('express');
const router = express.Router();
const jobTitleController = require('../controllers/jobTitleController');
const { protect } = require('../middlewares/auth');

router
    .route('/:id?')
    .get(protect, jobTitleController.getJobTitles)
    .post(protect, jobTitleController.createJobTitles)
    .delete(protect, jobTitleController.deleteJobTitles);


module.exports = router;