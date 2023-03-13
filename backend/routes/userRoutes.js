const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const authController=require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router
    .post('/signUp', authController.signup)
    .post('/logIn', authController.login)

/*          Many Users            */
router
    .route('/all')
    .post(userCtrl.createManyUsers)
    .get(userCtrl.getAllUsers)
    .put(userCtrl.updateManyUsers)
    .delete(userCtrl.deleteAllUsers)

router
    .route('/many')
    .post(userCtrl.createManyUsers)
    .get(userCtrl.getManyUsers)
    .put(userCtrl.updateManyUsers)
    .delete(userCtrl.deleteManyUsers)
/*           missing something            */
router
    .delete('/', userCtrl.delete)

/*           test            */
router.use('/test', protect, userCtrl.test)
router.use('/testWithRole', protect, userCtrl.testWithRole)

//************************************//

module.exports=router;