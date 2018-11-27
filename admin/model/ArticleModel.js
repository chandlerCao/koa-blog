const db = require('../../db');
class ArticleModel {
    // 文章添加
    async articleAdd(articleData) {
        const sql = 'insert into article (aid, title, preface, cover, tag_id, markdownText, markdownHtml) values (?, ?, ?, ?, ?, ?, ?);';
        const value = [articleData.aid, articleData.title, articleData.preface, articleData.cover_name, articleData.tag_id, articleData.markdownText, articleData.markdownHtml];
        return await db.query(sql, value);
    }
    // 获取文章列表
    async articleList() {
        const sql = `select atc.aid, atc.title, tag.tag_name, atc.date from article as atc left join tag on atc.tag_id = tag.tid order by atc.date desc`;
        return await db.query(sql);
    }
    // 获取文章内容
    async articleContentByAid(aid) {
        const sql = `select aid, title, preface, cover, tag_id, markdownText, markdownHtml from article where aid = ?`;
        const value = [aid];
        return await db.query(sql, value);
    }
    // 判断文章是否存在
    async articleExists(aid) {
        const sql = `select * from article where aid = ?`;
        const value = [aid];
        return await db.query(sql, value);
    }
    // 更新文章
    async articleUpdate(articleData) {
        const sql = `update article set title = ?, preface = ?, cover = ?, tag_id = ?, markdownText = ?, markdownHtml = ? where aid = ?`;
        const value = [articleData.title, articleData.preface, articleData.cover_name, articleData.tag_id, articleData.markdownText, articleData.markdownHtml, articleData.aid];
        return await db.query(sql, value);
    }
    // 删除文章
    async articleDel(aid) {
        const sql = `delete from article where aid = ?`;
        const value = [aid];
        return await db.query(sql, value);
    }
}
module.exports = ArticleModel;