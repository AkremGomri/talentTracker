const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields and skills/fieldController');
const factory = require('../../controllers/handleFactory');
const Field = require('../../models/fields and skills/fieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(
        protect,
        factory.getMyPermissions('field'),
        factory.Read(Field)
     )
    .post(fieldController.createFields)
    // .delete(fieldController.deleteOneField)
    .delete(fieldController.deleteFields)
    .patch(fieldController.updateField);

router
    .route('/update/:id')
    .post(fieldController.updateField)
    
module.exports = router;