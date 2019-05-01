'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const port = process.env.PORT || 9090;

app.use(cors());

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (request.method === "OPTIONS") {
        response.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE");

        return response.json({
            status: 200
        });
    }
    next();
});

app.use(
    session({
        secret: process.env.SECRET || 'login',
        cookie: {
            maxAge: 60000
        },
        resave: false,
        saveUninitialized: false
    })
);


if (!isProduction) {
    app.use(errorHandler());
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    });
} else {
    mongoose.connect('mongodb://localhost:27017/', {
        useNewUrlParser: true
    });
}
mongoose.Promise = global.Promise;

let apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

app.use((request, response, next) => {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

if (!isProduction) {
    app.use((error, request, response, next) => {
       console.error(error.stack);
       response.status(error.status || 500);
       response.json({
           'errors': {
               message: error.message,
               error: error
           }
       })
    });
} else {
    app.use((error, request, response, next) => {
        response.status(error.status || 500);
        response.json({
            'errors': {
                message: error.message,
                error: error
            }
        })
    });
}

var server = app.listen(port, () => {
   console.log(`Listening on http://127.0.0.1:${server.address().port}`);
});
