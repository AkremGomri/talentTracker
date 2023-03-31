const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const CompanyLogo = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    let name = file.originalname.split(' ').join('_');
    let extension = MIME_TYPES[file.mimetype];
    // if(name.includes(extension)){
    //     name = name.replace(extension, '').slice(0,-1)
    // }
    name = "company_logo"
    extension = "png"
    callback(null, name + '.' + extension);
  }
});

multerCompanyLogo = multer({storage: CompanyLogo}).single('file');



const company_image = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    console.log("hii");
    let name = file.originalname.split(' ').join('_');
    let extension = MIME_TYPES[file.mimetype];
    // if(name.includes(extension)){
    //     name = name.replace(extension, '').slice(0,-1)
    // }
    name = "company_image"
    extension = "png"
    callback(null, name + '.' + extension);
  }
});

multerCompanyImg = multer({storage: company_image}).single('file');

module.exports = multerCompanyImg;
module.exports = multerCompanyLogo;