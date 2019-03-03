const db = require('../../db');
class ArticleModel {
    // 文章添加
    async articleAdd(articleData) {
        const sql = 'insert into article (aid, title, preface, cover, tag_id, markdownText, markdownHtml, type_id) values (?, ?, ?, ?, ?, ?, ?, ?);';
        const value = [articleData.aid, articleData.title, articleData.preface, articleData.cover, articleData.tag_id, articleData.markdownText, articleData.markdownHtml, 1];
        return await db.query(sql, value);
    }
    // 获取文章列表
    async articleList(skip, limit) {
        const sql = `select atc.aid, atc.title, tag.tag_name, DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date from article as atc left join tag on atc.tag_id = tag.tid order by atc.date desc limit ?, ?`;
        return await db.query(sql, [skip, limit]);
    }
    // 文章总数
    async articleCount() {
        const sql = `select count(*) as total from article`;
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
        const value = [articleData.title, articleData.preface, articleData.cover, articleData.tag_id, articleData.markdownText, articleData.markdownHtml, articleData.aid];
        return await db.query(sql, value);
    }
    // 删除文章
    async articleDel(aids) {
        let delitem = '';
        aids.forEach(() => {
            delitem += '?,';
        });
        delitem = delitem.substring(0, delitem.length - 1);
        const sql = `delete from article where aid in (${delitem})`;
        return await db.query(sql, [...aids]);
    }
}
module.exports = ArticleModel;