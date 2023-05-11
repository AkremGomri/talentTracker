const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const authController=require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const multer = require('multer');

router
.post('/signUp', authController.signup)
.post('/login', authController.login)

/*              Me                */
router
.route('/me')
    // .get(protect, userCtrl.getMe)
    .put(protect, userCtrl.updateMe)
    // .delete(protect, userCtrl.deleteMe)

const images = multer({ dest: 'public/images/avatar' });
router
    .put('/my-photo/:id?',multer({ dest: 'public/images/avatar' }).single('image'), protect, userCtrl.updateProfilePhoto)

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
    
    router
    .route('/profile/:id?')
.get(protect, userCtrl.getProfil)
// .get(protect, userCtrl.getManyUsers) // I think any one connected no matter his role and permissions can do that.
// .put(protect, userCtrl.updateManyUsers)
// .delete(protect, userCtrl.deleteManyUsers)

/*           missing something            */
router
.delete('/', protect, userCtrl.deleteUser)
.delete('/:id', protect, userCtrl.deleteUserById)

/*           One User            */
router
.route('/')
.get(protect, userCtrl.getOneUser)

/*           test            */
router.use('/test', protect, userCtrl.test)
router.use('/testWithRole', protect, userCtrl.testWithRole)

const upload = multer({ dest: 'uploads/' });

router
    .put('/upload-excel', upload.single('file'), userCtrl.ExcelSaveUsers);
//************************************//

module.exports=router;