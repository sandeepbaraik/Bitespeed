const identityService = require('../Services/identityService');

var identitiyControllers = {};

identitiyControllers.getIdentity = async function (req, res) {
    console.log('req body: ',  req.body)
    let response = await identityService.getIdentity(req.body);
    res.status(200).send({contact: response});
}


module.exports = identitiyControllers;