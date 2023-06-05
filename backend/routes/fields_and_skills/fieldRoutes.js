const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields_and_skills/fieldController');
const factory = require('../../controllers/handleFactory');
const Field = require('../../models/fields_and_skills/fieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/update/:id')
    .post(fieldController.updateField)

// Admin
router.delete('/admin/', protect, fieldController.deleteAllFieldsAsDataBaseAdmin);

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(protect, fieldController.getFields)
    .post(protect, fieldController.createFields)
    // .delete(fieldController.deleteOneField)
    .delete(protect, fieldController.deleteFields)
    .patch(protect, fieldController.updateField)
    .put(protect, fieldController.updateField);


module.exports = router;