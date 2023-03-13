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
const AppError = require('./utils/appError');
const gloabalErrorHandler = require('./controllers/errorController');

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
const DB = process.env.MONGODB_URL.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB Connected')
    seedBD();
})
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
    process.emit('unhandledRejection', new Error('Custom unhandled rejection: cannot connect to mongoDB'));
});
// Handle errors
// app.use(errorHandler());

// Routes
app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime+ " the body"+req.body);
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
app.all('*', (req, res, next) => {
  return next(new AppError(`Endpoint Not Found: ${req.originalUrl}`, 404));
})

app.use(gloabalErrorHandler);

module.exports = app;