const db = require('../../db');
class ArticleModel {
    // 文章添加
    async articleAdd(articleData) {
        const sql = 'insert into article (aid, title, preface, cover, tag_id, markdownText, markdownHtml, type_id, state) values (?, ?, ?, ?, ?, ?, ?, ?, ?);';
        const value = [articleData.aid, articleData.title, articleData.preface, articleData.cover, articleData.tag_id, articleData.markdownText, articleData.markdownHtml, 1, articleData.state];
        return await db.query(sql, value);
    }
    // 获取文章列表
    async articleList(state, skip, limit) {
        const sql = `select atc.aid, atc.title, tag.tag_name, DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date from article as atc left join tag on atc.tag_id = tag.tid where atc.state = ? order by atc.date desc limit ?, ?`;
        return await db.query(sql, [state, skip, limit]);
    }
    // 文章总数
    async articleCount(state) {
        const sql = `select count(*) as total from article where state = ?`;
        return await db.query(sql, [state]);
    }
    // 获取文章内容
    async articleContentByAid(aid) {
        const sql = `select aid, title, preface, cover, tag_id, markdownText, markdownHtml, state from article where aid = ?`;
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
        const sql = `update article set title = ?, preface = ?, cover = ?, tag_id = ?, markdownText = ?, markdownHtml = ?, state = ? where aid = ?`;
        const value = [articleData.title, articleData.preface, articleData.cover, articleData.tag_id, articleData.markdownText, articleData.markdownHtml, articleData.state, articleData.aid];
        return await db.query(sql, value);
    }
    // 删除文章
    async articleDel(aids) {
        let aidsStr = aids.concat([]).fill('?').join(',');
        const sql = `delete from article where aid in (${aidsStr})`;
        return await db.query(sql, aids);
    }
    // 文章垃圾箱
    async articleDustbin(aids) {
        let aidsStr = aids.concat([]).fill('?').join(',');
        const sql = `update article set state = -1 where aid in (${aidsStr})`;
        return await db.query(sql, aids);
    }
    // 关键字搜索文章
    async getArticleBySearch(searchValue, state, skip, len) {
        const sql = `select atc.aid, atc.title, atc.preface, DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date, atc.read_count,
        tag.tag_name, count(al.aid) as like_count, (select count(*) from art_like where aid = atc.aid) as is_like
        from article as atc
        left join art_like as al on atc.aid = al.aid
        left join tag on atc.tag_id = tag.tid
        where atc.state = ? and (atc.aid like binary'${searchValue}%' or atc.title like binary'%${searchValue}%' or atc.preface like binary'%${searchValue}%' or atc.markdownHtml like binary'%${searchValue}%')
        group by atc.aid
        order by atc.date desc
        limit ?, ?`;
        return await db.query(sql, [state, skip, len]);
    }
    // 关键字搜索总数
    async getArticleTotalBySearch(searchValue, state) {
        const sql = `select count(*) as total from article as atc where atc.state = ? and (atc.title like '%${searchValue}%' or atc.preface like '%${searchValue}%' or atc.markdownHtml like '%${searchValue}%')`;
        return await db.query(sql, [state]);
    }
}
module.exports = ArticleModel;