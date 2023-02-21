// Require Dependencies
const dotenv=require('dotenv').config();;
const express = require("express")
const morgan = require("morgan")
// const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const mongoose = require('mongoose');

// const logger = require("@util/logger");

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
}).then(() => console.log('DB Connected'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

// Handle errors
// app.use(errorHandler());

// Routes


// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})
module.exports = app;