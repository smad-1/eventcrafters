const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQLPass123",
    database: "eventcrafters"
});
module.exports = conn;