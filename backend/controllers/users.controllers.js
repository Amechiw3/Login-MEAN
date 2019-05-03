'use strict';

const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.index = (request, response) => {
    User.find()
        .exec()
        .then(user =>{
            const data = {
                count: user.length,
                users: user.map(user => {
                    return {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    };
                })
            }
            response.json({
                status: 200,
                message: 'Users retrieved success!!',
                data: data
            })
        })
        .catch(error => {
           response.json({
               status: 500,
               error: error
           })
        });
};

exports.new = (request, response) => {
  const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: request.body.username,
      email: request.body.email
  });
  user.setPassword(request.body.password);

  user.save()
      .then(result => {
          response.json({
              status: 201,
              message: "Created user success!!",
              createdUser: {
                  _id: result._id,
                  username: result.username,
                  email: result.email
              }
          });
      })
      .catch(error => {
          response.json({
              status: 500,
              error: error
          });
      })

};

exports.view = (request, response) => {
    User.findById(request.params.id)
        .exec()
        .then(user => {
            if (user) {
                response.json({
                    status: 200,
                    user: user.toAuthJSON()
                });
            } else {
                response.json({
                    status: 500,
                    message: "ID is not valid"
                });
            }
        })
        .catch( err => {
            response.json({
                status: 404,
                message: 'USER NOT FOUND',
                error: err
            })
        });
};

exports.update = (request, response) => {
    User.findById(request.params.id)
        .then(user => {
            if (!user) return response.sendStatus(401);

            if (typeof request.body.username !== 'undefined') { user.username = request.body.username; }
            if (typeof request.body.email !== 'undefined') { user.email = request.body.email; }
            if (typeof request.body.bio !== 'undefined') { user.bio = request.body.bio; }
            if (typeof request.body.image !== 'undefined') { user.image = request.body.image; }
            if (typeof request.body.password !== 'undefined') { user.setPassword(request.body.password); }

            return user.save().then(() =>{
                response.json({
                    status: 200,
                    message: 'User updated',
                    user: user.toAuthJSON()
                })
            });
        })
        .catch( err => {
            response.json({
                status: 404,
                message: 'USER NOT FOUND',
                error: err
            })
        });
};

exports.delete = (request, response) => {
    User.findById(request.params.id)
        .then(user => {
            if (!user) return response.sendStatus(401);
            user.remove(err => {
                if (err) {
                    response.json({
                        status: 500,
                        message: err
                    })
                }
                response.json({
                    status: 200,
                    message: 'User deleted'
                })
            })
        })
        .catch( err => {
            response.json({
                status: 404,
                message: 'USER NOT FOUND',
                error: err
            })
        });
};
