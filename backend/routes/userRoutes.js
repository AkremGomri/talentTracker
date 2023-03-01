const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const auth = require('../middlewares/auth');

router
    .post('/signUp', userCtrl.signup)
    .post('/logIn', userCtrl.login)

/*          Dabatabase easy manipulation            */
router
    .route('/users')
    .post(userCtrl.createManyUsers)
    .get(userCtrl.getAllUsers)
    .put(userCtrl.updateManyUsers)
    .delete(userCtrl.deleteAllUsers)



/*           missing something            */
router
    .delete('/delete', userCtrl.delete)

/*           test            */
router.use('/test', auth, userCtrl.test)

//************************************//

module.exports=router;