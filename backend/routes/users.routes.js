'use strict';

const router = require('express').Router();
const userController = require('../controllers/users.controllers');

router.route('/users').get(userController.index);
router.route('/users').post(userController.new);

module.exports = router;
