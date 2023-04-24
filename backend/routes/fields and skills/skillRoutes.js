const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields and skills/fieldController');
const factory = require('../../controllers/handleFactory');
const Skill = require('../../models/fields and skills/skillModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(protect,factory.Read(Skill, {
        path: 'parentSubField skillElements',
        select: 'name'
      }))
    .post(protect, factory.Create(Skill))
    // .delete(fieldController.deleteOneField)
    .delete(protect, factory.Delete(Skill))
    .patch(fieldController.updateField);

router
    .route('/update/:id')
    .post(fieldController.updateField)
    
module.exports = router;