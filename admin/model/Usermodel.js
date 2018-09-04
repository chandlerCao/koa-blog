const db = require('../../db');
class User {
    async register(id, username, password) {
        const sql = 'insert into user (uid, username, password) values (?, ?, ?);';
        const values = [id, username, password];
        const res = await db.query(sql, values);
        return res;
    }
    async login(username, password) {
        const sql = 'select * from user where username = ? and password = ?';
        const values = [username, password];
        const res = await db.query(sql, values);
        return res;
    }
    async checkUser(username) {
        const sql = 'select username from user where username = ?';
        const values = [username];
        const res = await db.query(sql, values);
        return res;
    }
}
module.exports = User;