const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool(config.db);

// create table if not exists
let createTableQuery = `CREATE TABLE IF NOT EXISTS Contact (
    id INT NOT NULL AUTO_INCREMENT,
    phoneNumber VARCHAR(15),
    email VARCHAR(225),
    linkedId INT DEFAULT NULL,
    linkPrecedence VARCHAR(15),
    createdAt DATETIME,
    updatedAt DATETIME,
    deletedAt DATETIME,
    PRIMARY KEY (id)
  )`
query(createTableQuery);

// Function to query the database
function query(sql, params) {
  return new Promise((resolve, reject) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      // Execute the query
      connection.query(sql, params, (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}

module.exports = {
  query
};