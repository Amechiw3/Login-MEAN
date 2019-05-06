require('dotenv').config();
export const keys = {

    "NODE_ENV": process.env.NODE_ENV || "development",
    "PORT": process.env.PORT || "9080",
    "MONGODB_URI": process.env.MONGODB_URI || "mongodb://localhost:27017/ts-login",
    "SECRET": process.env.NODE_ENV === "production" ? process.env.SECRET : 'ts-login'

};
