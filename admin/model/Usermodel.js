const db = require('../../db');
class User {
    // 注册
    async register(id, username, password, avatar) {
        const sql = `insert into user (uid, username, password, isAdmin, avatar) values ('${id}', '${username}', '${password}', 1, '${avatar}')`;
        return await db.query(sql);
    }
    // 登录
    async login(username, password) {
        const sql = `select * from user where username = '${username}' and password = '${password}'`;
        return await db.query(sql);
    }
    // 检查用户是否存在
    async checkUser(username) {
        const sql = `select username from user where username = '${username}'`;
        return await db.query(sql);
    }
    // 获取用户信息
    async getUserInfo(uid) {
        const sql = `select * from user where uid = '${uid}'`;
        return await db.query(sql)
    }
    // 用户列表
    async userList(searchValue, skip, limit) {
        const sql = `SELECT
            *
        FROM
            user
        WHERE
            (
                uid LIKE BINARY '%${searchValue}%'
                OR username LIKE BINARY '%${searchValue}%'
            )
        LIMIT ${skip}, ${limit}`;
        return await db.query(sql);
    }
    // 用户总数
    async userCount(searchValue) {
        const sql = `SELECT
            count(*) total
        FROM
            user
        WHERE
            (
                uid LIKE BINARY '%${searchValue}%'
                OR username LIKE BINARY '%${searchValue}%'
            )`;
        return await db.query(sql);
    }
    // 删除用户
    async userDelete(uid) {
        const sql = `delete from user where uid in ('${uid}')`;
        return await db.query(sql);
    }
}
module.exports = User;