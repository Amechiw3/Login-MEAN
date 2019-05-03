'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/config').secret;

const userSchema = new mongoose.Schema({
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
    hash: { type: String },
    salt: { type: String }
}, { timestamps: true });
userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

userSchema.methods.validPassword = (password) => {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
userSchema.methods.setPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
userSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};
userSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

var Users = module.exports = mongoose.model('users', userSchema);
module.exports.get = (callback, limit) => {
  Users.find(callback).limit(limit);
};

