const db = require('../../db');
class ArticleModel {
    async articleAdd(articleData) {
        const sql = 'insert into article (aid, title, preface, img, tag, content) values (?, ?, ?, ?, ?, ?);';
        const value = [articleData.aid, articleData.title, articleData.preface, articleData.img, articleData.tag, articleData.content];
        return await db.query(sql, value);
    }
}
module.exports = ArticleModel;