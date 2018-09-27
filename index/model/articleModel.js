const db = require('../../db');
class articleModel {
    async getArticleList(len, skip) {
        const sql = 'select aid, date, preface, title from article order by date desc limit ?, ?';
        const value = [skip, len];
        return await db.query(sql, value);
    }
    async getArticleByHash(aid) {
        const sql = 'select * from article where aid = ?';
        const value = [aid];
        return await db.query(sql, value);
    }
}
module.exports = articleModel;