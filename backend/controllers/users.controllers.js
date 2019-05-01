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
