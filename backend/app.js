// Require Dependencies
const dotenv=require('dotenv').config();;
const express = require("express")
const morgan = require("morgan")
// const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//import routes
const userRoutes = require('./routes/userRoutes');
const fieldRoutes = require('./routes/fields and skills/fieldRoutes');
const subFieldRoutes = require('./routes/fields and skills/subFieldRoutes');
const skillRoutes = require('./routes/fields and skills/skillRoutes');
const roleRoutes = require('./routes/roleRoutes');
const configRoutes = require('./routes/configRoutes');
// const logger = require("@util/logger");
const seedBD = require('./utils/seedDB');
const app = express();
const AppError = require('./utils/appError');
const gloabalErrorHandler = require('./controllers/errorController');
const path = require('path');

const { protect } = require('./middlewares/auth.js');
// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));
app.use(morgan('dev'));
// app.use(cookieParser());
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(bodyParser.json());

// Configure custom logger middleware
// app.use(logger.dev, logger.combined);


// This middleware adds the json header to every response

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
  console.log(req.requestTime+ " the body "+JSON.stringify(req.body));
  next()
});

app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

app.use('/api/user/', userRoutes);
app.use('/api/skills/', skillRoutes);
app.use('/api/fields/', fieldRoutes);
app.use('/api/subFields/', subFieldRoutes);
app.use('/api/admin/', protect, roleRoutes);
app.use('/api/config', configRoutes);

/* static files */
app.use(express.static(path.join('public'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Handle not valid route
app.use((req, res, next) => {
  return next(new AppError(`Endpoint Not Found: ${req.originalUrl}`, 404));
})

app.use(gloabalErrorHandler);

module.exports = app;