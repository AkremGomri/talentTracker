const express = require('express');
const router = express.Router();
const skillController = require('../../controllers/fields_and_skills/skillController');
const factory = require('../../controllers/handleFactory');
const Skill = require('../../models/fields_and_skills/skillModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(protect, skillController.getSkills)
    .post(protect, skillController.createSkills)
    // .delete(fieldController.deleteOneField)
    .delete(protect, skillController.deleteSkills)
    .put(protect, skillController.updateSkill);

router
    .route('/update/:id')
    .post(protect, skillController.updateSkill)
    
module.exports = router;