var express = require('express');
var router = express.Router();
const identityController = require('../Controllers/identityController')

router.post('/identity', identityController.getIdentity);

module.exports = router;
