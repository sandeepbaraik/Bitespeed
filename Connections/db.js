const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool(config.db);

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