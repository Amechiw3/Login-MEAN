import * as mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from '../interfaces/IUsers';
import crypto from 'crypto';

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [ true, "Cant be blank" ],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [ true, "Cant be blank" ],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    image:{ type: String },
    bio:  { type: String },
    hash: { type: String, select: false },
    salt: { type: String, select: false }
}, { timestamps: true });
schema.plugin(uniqueValidator, {message: 'is already taken.'});

export const UserSchema = mongoose.model<IUser>('user', schema, 'users', true);

