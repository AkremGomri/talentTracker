const express = require('express');
const router = express.Router();
const subFieldController = require('../../controllers/fields_and_skills/subFieldController');
const factory = require('../../controllers/handleFactory');
const subField = require('../../models/fields_and_skills/subFieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(subFieldController.getAllFields)
    .get(protect, subFieldController.getFields)
    .post(protect, subFieldController.createFields)
    // .delete(subFieldController.deleteOneField)
    .delete(protect, subFieldController.deleteFields)
    .put(protect, subFieldController.updateField);

router
    .route('/update/:id')
    .post(subFieldController.updateField)

module.exports = router;