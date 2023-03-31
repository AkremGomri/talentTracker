const express = require('express');
const router = express.Router();
require('../middlewares/multer-config');
const { protect } = require('../middlewares/auth');
const path = require('path');

router.post('/upload/company_logo', multerCompanyLogo, (req, res) => {
  res.status(200).json({message: 'File saved !'});
});

router.post('/upload/company_img', multerCompanyImg, (req, res) => {
  res.status(200).json({message: 'File saved !'});
});

router.get('/company_logo', (req, res) => {
    console.log('dirname: ' + __dirname);
    console.log('path: ' + path);
    console.log('path: ' + path.join(__dirname, '../public/images/company_logo.png'));
    res.sendFile(path.join(__dirname, '../public/images/company_logo.png'));
  });

module.exports = router