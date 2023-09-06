const db = require('../Connections/db');
const moment = require('moment');

let identityService = {}

identityService.getIdentity = async function (data) {
    try {
        // Query for records with the same email or phoneNumber as the payload.
        let queryString = `select * from Contact where email = "${data.email}" OR phoneNumber = "${data.phoneNumber}"`;
        let response = await db.query(queryString);
        let createRes;
        let resObj = { "emails": [], "phoneNumbers": [], "secondaryContactIds": [] };
        let filteredResponse = [];
        // If record(s) exist for the given email or phoneNumber
        if (response && response.length > 0) {
            filteredResponse = response.filter(item => item.email == data.email || item.phoneNumber == data.phoneNumber);
            // sort to get the oldest record
            filteredResponse.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            let linkedId = (filteredResponse[0].linkedId) ? filteredResponse[0].linkedId : filteredResponse[0].id;
            for (let i = 1; i < filteredResponse.length; i++) {
                filteredResponse[i].linkPrecedence = 'secondary';
                filteredResponse[i].linkedId = linkedId;
            }

            // create a array of promises of queries to update and insert data.
            let promises = [];
            for (let item of filteredResponse) {
                promises.push(db.query(`UPDATE Contact SET linkedId = "${item.linkedId}", linkPrecedence = "${item.linkPrecedence}", updatedAt = now() WHERE id = "${item.id}"`));
            }
            let record = filteredResponse.find(item => item.email == data.email && item.phoneNumber == data.phoneNumber);
            if(record == undefined){
                promises.push(db.query(`INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt) VALUES ("${data.phoneNumber}", "${data.email}",
                ${linkedId}, "secondary", now(), now())`));
            }
            let res = await Promise.allSettled(promises);
        } else {
            let createQuery = `INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt) VALUES ("${data.phoneNumber}", "${data.email}", NULL, "primary",
                               now(), now())`;
            createRes = await db.query(createQuery);
        }
        // Query to fetch records and create a response object
        response = await db.query(queryString);
        if (response && response.length > 0) {
            let emails = new Set();
            let phones = new Set();
            for (let item of response) {
                emails.add(item.email);
                phones.add(item.phoneNumber);
                if (item.linkPrecedence == 'primary') {
                    resObj['primaryContatctId'] = item.id;
                } else {
                    resObj.secondaryContactIds.push(item.id);
                }
            }
            resObj.emails = Array.from(emails);
            resObj.phoneNumbers = Array.from(phones);
        }
        return resObj;
    } catch (error) {
        console.log(error);
    }
}

module.exports = identityService;


