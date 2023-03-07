// Require Dependencies
const dotenv=require('dotenv').config();;
const express = require("express")
const morgan = require("morgan")
// const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const mongoose = require('mongoose');

//import routes
const userRoutes = require('./routes/userRoutes')
const roleRoutes = require('./routes/roleRoutes')
// const logger = require("@util/logger");
const seedBD = require('./utils/seedDB');
const multer = require('multer');
const app = express();

// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));
app.use(morgan('dev'));
// app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Configure custom logger middleware
// app.use(logger.dev, logger.combined);


// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

//dabase connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB Connected')
    seedBD();
})
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});
// Handle errors
// app.use(errorHandler());

// Routes
app.use('/', (req, res, next) => {
    console.log("the url: "+ req.url+ " the body"+req.body);
    next()
});
/*                           */
const User = require('./models/userModel');
const xlsx = require('xlsx');
const constants = require('./utils/constants/users_abilities');
const upload = multer({ dest: 'uploads/' });
app.post('/upload-excel', upload.single('file'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const usersData = xlsx.utils.sheet_to_json(worksheet);
    User.insertMany(usersData, (error, docs) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else {
        res.status(201).json({ message: 'Data inserted successfully!' });
      }
    });
  });
app.use('/user/',userRoutes);
app.use('/admin/',roleRoutes);

// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})
module.exports = app;