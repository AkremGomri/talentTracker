const express=require('express');
const router =express.Router();
const roleCtrl=require('../controllers/roleController');
const auth = require('../middlewares/auth');



router
    .route('/role/:id?')
    .post(roleCtrl.createNewRole)
    .get(roleCtrl.getRole)
    .put(roleCtrl.updateRole)
    .delete(roleCtrl.deleteRole)

    // .get(roleCtrl.login)
    // .delete(roleCtrl.login)
    // .update(roleCtrl.login)

/*           missing something            */

// router
//     .delete('/delete', userCtrl.delete)

/*           test            */
// router.use('/test', auth, userCtrl.test)

//************************************//

module.exports=router;