const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const auth = require('../middlewares/auth');

router
    .post('/signUp', userCtrl.signup)
    .post('/logIn', userCtrl.login)

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
router.use('/test', auth, userCtrl.test)

//************************************//

module.exports=router;