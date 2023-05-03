const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const authController=require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router
.post('/signUp', authController.signup)
.post('/login', authController.login)

/*          Many Users            */
router
.route('/all')
.post(protect, userCtrl.createManyUsers)
.get(protect, userCtrl.getAllUsers)
.put(protect, userCtrl.updateManyUsers)
.delete(protect, userCtrl.deleteAllUsers)

router
.route('/many')
.post(protect, userCtrl.createManyUsers)
.get(protect, userCtrl.getManyUsers) // I think any one connected no matter his role and permissions can do that.
.put(protect, userCtrl.updateManyUsers)
.delete(protect, userCtrl.deleteManyUsers)
/*           missing something            */
router
    .delete('/', protect, userCtrl.deleteUser)
    .delete('/:id', protect, userCtrl.deleteUserById)

/*           test            */
router.use('/test', protect, userCtrl.test)
router.use('/testWithRole', protect, userCtrl.testWithRole)

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router
    .post('/upload-excel', upload.single('file'), userCtrl.ExcelSaveUsers);
//************************************//

module.exports=router;