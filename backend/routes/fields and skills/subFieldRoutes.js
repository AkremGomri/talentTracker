const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/fields and skills/fieldController');
const factory = require('../../controllers/handleFactory');
const subField = require('../../models/fields and skills/subFieldModel');
const { protect } = require('../../middlewares/auth');

router
    .route('/:id?')
    // .get(fieldController.getAllFields)
    .get(protect,factory.Read(subField, {
        path: 'parentField skills',
        select: 'name'
      }))
    .post(protect, factory.Create(subField))
    // .delete(fieldController.deleteOneField)
    .delete(protect, factory.Delete(subField))
    .patch(fieldController.updateField);

router
    .route('/update/:id')
    .post(fieldController.updateField)

module.exports = router;