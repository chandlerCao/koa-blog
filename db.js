const mysql = require('mysql');
const config = require('./config');
// 数据库通用操作
function query(sql, values) {
    return new Promise((resolve, reject) => {
        // 连接数据库
        const connection = mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
        });
        connection.connect();
        connection.query(sql, values, (err, res) => {
            if (err) {
                reject(err);
            }
            else resolve(res);
            connection.end();
        });
    })
}
module.exports = {
    query
}