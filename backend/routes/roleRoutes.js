const express=require('express');
const router =express.Router();
const roleCtrl=require('../controllers/roleController');
// const auth = require('../middlewares/auth.js');



router
    .route('/role/:id?')
    .post(roleCtrl.createNewRole)
    .get(roleCtrl.getRole)
    .put(roleCtrl.updateRole)
    .delete(roleCtrl.deleteRole)

    router
        .get('/roles/names', roleCtrl.readAllRolesNames)
    
    router    
    .route('/roles')
    .post(roleCtrl.createManyRoles)
    .get(roleCtrl.getAllRoles)
    .put(roleCtrl.updateManyRoles)
    .delete(roleCtrl.deleteManyRoles)
    /*          Dabatabase easy manipulation            */
router
    .route('/roles/all')
    .post(roleCtrl.createManyRoles)
    .get(roleCtrl.getAllRoles)
    .put(roleCtrl.updateManyRoles)
    .delete(roleCtrl.deleteAllRoles)
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