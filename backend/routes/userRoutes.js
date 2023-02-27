const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');

router.post('/signUp', userCtrl.signup)

/*           matches            */


//************************************//
module.exports=router;