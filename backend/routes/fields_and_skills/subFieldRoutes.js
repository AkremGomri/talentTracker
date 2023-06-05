const express = require('express');
const router = express.Router();
const subFieldController = require('../../controllers/fields_and_skills/subFieldController');
const factory = require('../../controllers/handleFactory');
const subField = require('../../models/fields_and_skills/subFieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/update/:id')
    .post(subFieldController.updateSubField)


// Admin
router.delete('/admin/', protect, subFieldController.deleteAllSubFieldsAsDataBaseAdmin);

router
    .route('/:id?')
    // .get(subFieldController.getAllFields)
    .get(protect, subFieldController.getSubFields)
    .post(protect, subFieldController.createSubFields)
    // .delete(subFieldController.deleteOneField)
    .delete(protect, subFieldController.deleteSubFields)
    .patch(protect, subFieldController.updateSubField)
    .put(protect, subFieldController.updateSubField);


module.exports = router;