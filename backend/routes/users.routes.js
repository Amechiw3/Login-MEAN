'use strict';

const router = require('express').Router();
const userController = require('../controllers/users.controllers');

router.route('/users').get(userController.index)
                            .post(userController.new);

router.route('/users/:id').get(userController.view)
                                .put(userController.update)
                                .patch(userController.update)
                                .delete(userController.delete);


module.exports = router;
