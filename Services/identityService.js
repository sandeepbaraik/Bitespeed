const db = require('../Connections/db');
const config = require('../Connections/config');
const moment = require('moment');

let identityService = {}

identityService.getIdentity = async function (data) {
    let queryString = `select * from Contact where email = "${data.email}"`;
    let response = await db.query(queryString);
    let createRes;
    let resObj = { "emails": [], "phoneNumbers": [], "secondaryContactIds": [] }
    if (response && response.length > 0) {
        let filteredResponse = response.filter(item => item.email == data.email || item.phoneNumber == data.phoneNumber);
        filteredResponse.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        filteredResponse[0].linkPrecedence = 'primary';
        for(let i = 1; i < filteredResponse.length; i++) {
            filteredResponse[i].linkPrecedence = 'secondary';
            filteredResponse[i].linkedId = filteredResponse[0].id;
        }        
        console.log('filteredResponse: ', filteredResponse);
        let queries = [];
        for(let item of filteredResponse) {
            queries.push(`UPDATE Contact SET linkedId = "${item.linkedId}", linkPrecedence = "${item.linkPrecedence}", updatedAt = now() WHERE id = "${item.id}"`);
            // await db.query(query);
        }
        
        queries.push(`INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt) VALUES ("${data.phoneNumber}", "${data.email}",
                    "${filteredResponse[0].id}", "secondary", now(), now())`);
        await Promise.allSettled(queries);
        // createRes = await db.query(createQuery);
    } else {
        console.log("data: ", data);
        let createQuery = `INSERT INTO Contact (phoneNumber, email, linkPrecedence, createdAt, updatedAt) VALUES ("${data.phoneNumber}", "${data.email}", "primary",
                           now(), now())`
        createRes = await db.query(createQuery);
    }
    response = await db.query(queryString);
    if (response && response.length > 0) {
        for (let item of response) {
            resObj.emails.push(item.email);
            resObj.phoneNumbers.push(item.phoneNumber);
            if (item.linkPrecedence == 'primary') {
                resObj['primaryContatctId'] = item.id;
            } else {
                resObj.secondaryContactIds.push(item.id);
            }
        }
    }
    return resObj;
}


module.exports = identityService;


