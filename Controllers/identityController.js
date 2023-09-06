const identityService = require('../Services/identityService');

var identitiyControllers = {};

identitiyControllers.getIdentity = async function (req, res) {
    try {
        console.log('req body: ',  req.body);
        let response = await identityService.getIdentity(req.body);
        res.status(200).send({contact: response});
    } catch(error) {
        res.status(500).send(error);
    }
    
}

module.exports = identitiyControllers;