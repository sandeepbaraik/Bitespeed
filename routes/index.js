var express = require('express');
var router = express.Router();
const identityController = require('../Controllers/identityController')

/* GET home page. */
router.post('identity', getIdentity);

module.exports = router;
