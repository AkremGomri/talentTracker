const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields and skills/fieldController');
const factory = require('../../controllers/handleFactory');
const Field = require('../../models/fields and skills/fieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(protect,factory.Read(Field))
    .post(protect, factory.Read)
    // .delete(fieldController.deleteOneField)
    .delete(protect, factory.Delete(Field))
    .patch(fieldController.updateField);

router
    .route('/update/:id')
    .post(fieldController.updateField)
    
module.exports = router;