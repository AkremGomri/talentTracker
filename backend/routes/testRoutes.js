const express=require('express');
const router =express.Router();
const testCtrl=require('../controllers/testController');
const { protect } = require('../middlewares/auth');

router
    .route('/')
    .get(protect, testCtrl.getAllTests)
    .post(protect, testCtrl.createTest)
    .delete(protect, testCtrl.deleteAllTests)

router
    .route('/Many')
    .delete(protect, testCtrl.deleteTests)
    
router
    .route('/:id')
    .get(protect, testCtrl.getTest)
    .put(protect, testCtrl.updateTest)
    .delete(protect, testCtrl.deleteTest)

router.post("/passTest", protect, testCtrl.takeTest)
router.post("/validateTest", protect, testCtrl.validateTest)

module.exports = router;