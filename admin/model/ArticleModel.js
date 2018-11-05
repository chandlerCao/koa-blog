const db = require('../../db');
class ArticleModel {
    async articleAdd(articleData) {
        const sql = 'insert into article (aid, title, preface, cover, tag_id, content) values (?, ?, ?, ?, ?, ?);';
        const value = [articleData.aid, articleData.title, articleData.preface, articleData.cover_key, articleData.tag_id, articleData.content];
        return await db.query(sql, value);
    }
}
module.exports = ArticleModel;