const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields and skills/fieldController');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(fieldController.getFields)
    .post(fieldController.createFields)
    // .delete(fieldController.deleteOneField)
    .delete(fieldController.deleteFields)
    .patch(fieldController.updateField);

router
    .route('/update/:id')
    .post(fieldController.updateField)
    
module.exports = router;