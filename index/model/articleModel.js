const db = require('../../db');
class articleModel {
    async getArticleList(len, skip) {
        const sql = 'select arc.aid, arc.date, arc.preface, arc.title, arc.cover, tag.tag_name from article as arc inner join tag on arc.tag_id = tag.tid order by arc.date desc limit ?, ?';
        const value = [skip, len];
        return await db.query(sql, value);
    }
    async getArticleCnt(aid) {
        const sql = 'select * from article where aid = ?';
        const value = [aid];
        return await db.query(sql, value);
    }
}
module.exports = articleModel;