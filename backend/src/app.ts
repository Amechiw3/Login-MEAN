import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import { keys } from "./keys";

// Initializations
const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const port = keys.PORT;
import './database';

// Settings
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
app.use(session({ secret: process.env.SECRET || 'login', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
if (!isProduction) {
    app.use(errorHandler());
}
// Middlewares
// Routes
import apiRoutes from './routes/api.routes';
app.use('/api', apiRoutes);

if (!isProduction) {
    app.use((error: any, request: Request, response: Response, next: NextFunction) => {
       console.error(error.stack);
       response.status(error.status || 500);
       response.json({
           errors: {
               message: error.message,
               error
           }
       });
    });
}
else {
    app.use((error: any, request: Request, response: Response, next: NextFunction) => {
        response.status(error.status || 500);
        response.json({
            errors: {
                message: error.message,
                error
            }
        });
    });
}

// Startin the server
var server = app.listen(port, () => {
   // @ts-ignore
    console.log(`Listening on http://127.0.0.1:${server.address().port}`);
});
