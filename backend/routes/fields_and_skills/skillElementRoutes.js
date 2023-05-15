const express = require('express');
const skillElementController = require('../../controllers/fields_and_skills/skillElementController');
const factory = require('../../controllers/handleFactory');
const Skill = require('../../models/fields_and_skills/skillModel');
const { protect } = require('../../middlewares/auth');

const router = express.Router({ mergeParams: true });


router
    .route('/:id?')
        .post(protect, skillElementController.createElementSkills)
//     .get(protect, skillElementController.getSkills)
//     // .delete(fieldController.deleteOneField)
//     .delete(protect, skillElementController.deleteSkills)
//     .put(protect, skillElementController.updateSkill)
//     .patch(protect, skillElementController.updateSkill);

// router
//     .route('/update/:id')
//     .post(protect, skillElementController.updateSkill)
    
module.exports = router;