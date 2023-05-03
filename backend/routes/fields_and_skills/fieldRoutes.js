const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields_and_skills/fieldController');
const factory = require('../../controllers/handleFactory');
const Field = require('../../models/fields_and_skills/fieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(protect, fieldController.getFields)
    .post(protect, fieldController.createFields)
    // .delete(fieldController.deleteOneField)
    .delete(protect, fieldController.deleteFields)
    .put(protect, fieldController.updateField);

router
    .route('/update/:id')
    .post(fieldController.updateField)

module.exports = router;