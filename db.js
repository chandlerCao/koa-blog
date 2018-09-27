const mysql = require('mysql');
// 数据库通用操作
function query(sql, values) {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
            // 连接数据库
            const connection = mysql.createConnection({
                host : 'localhost',
                user : 'root',
                password : '759260',
                database : 'blog'
            });
            connection.connect();
            connection.query(sql, values, (err, res) => {
                if(err) {
                    reject(err);
                }
                else resolve(res);
                connection.end();
            });
        // }, 1000);
    })
}
module.exports = {
    query
}