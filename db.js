const mysql = require('mysql');
// 数据库通用操作
function query(sql, values) {
    return new Promise((resolve, reject) => {
        // 连接数据库
        const connection = mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '759260',
            database: 'blog'
        });
        connection.connect();
        connection.query(sql, values, (err, res) => {
            console.log(err)
            if (err) reject(err);
            else resolve(res);
            connection.end();
        });
    })
};
module.exports = { query }