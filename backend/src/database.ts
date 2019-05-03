import mongoose from "mongoose";
import { keys } from './keys'

const isProduction = keys.NODE_ENV === 'production';

if (!isProduction) {
    mongoose.connect(keys.MONGODB_URI, {
        useNewUrlParser: true
    })
        .then(db => console.log("db is connected"))
        .catch(err => console.log(err));
} else {
    mongoose.connect('mongodb://localhost:27017/ts-login', {
        useNewUrlParser: true
    })
        .then(db => console.log("db is connected"))
        .catch(err => console.log(err));
}
