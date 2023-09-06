const mysql = require('mysql');
const config = require('./config');

// async function query(sql, params) {
//   const connection = await mysql.createConnection(config.db);
//   // const [results, ] = await connection.execute(sql, params);

//   return connection;
// }

// module.exports = {
//   query
// }

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