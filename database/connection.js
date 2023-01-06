const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'social_media',
    debug    :  false
});

module.exports = pool;