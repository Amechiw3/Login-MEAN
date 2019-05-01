'use strict';
const router = require('express').Router();

router.get('/', (request, response) => {
   response.json({
      status: 200,
      message: 'Welcome to API RESTFul'
   });
});

router.use( require('./users.routes') );


module.exports = router;
