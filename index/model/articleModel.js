const db = require('../../db');
class articleModel {
    // 获取文章列表
    async getArticleList(ip, type, skip, len) {
        const sql = `select atc.aid, atc.title, atc.preface , atc.cover, atc.tag_id, atc.type_id, DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date, atc.read_count, tag.tag_name, count(al.aid) as like_count, (select count(*) from art_like where uip = ? and aid = atc.aid) as is_like
        from article as atc
        left join art_like as al on atc.aid = al.aid
        left join tag on atc.tag_id = tag.tid
        left join type on atc.type_id = type.type_id where type.type_text = ? and atc.state = 1
        group by atc.aid
        order by atc.date desc
        limit ?, ?`;
        return await db.query(sql, [ip, type, skip, len]);
    }
    // 获取文章总数
    async getArticleTotal(type) {
        const sql = `select count(*) as total from article
        left join type on article.type_id = type.type_id where type.type_text = ?`;
        return await db.query(sql, [type]);
    }
    // 获取当前标签名称获取文章总数
    async getArticleTotalByTag(tagName) {
        const sql = `select count(*) as total from article
        left join tag on article.tag_id = tag.tid where tag.tag_name = ?`;
        return await db.query(sql, [tagName]);
    }
    // 获取文章内容
    async getArticleCnt(aid, ip) {
        const sql = `select atc.*, DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date, (select count(*) from art_like where aid = ? and uip = ?) as is_like, tag.tag_name, count(al.aid) as like_count from article as atc
        left join art_like as al on al.aid = ?
        left join tag on atc.tag_id = tag.tid
        where atc.aid = ?
        group by atc.aid`;
        return await db.query(sql, [aid, ip, aid, aid]);
    }
    // 判断当前文章是否存在
    async articleExist(aid) {
        const sql = `select count(*) as articleExist from article where aid = ?`;
        return await db.query(sql, [aid]);
    }
    // 获取文章标签列表
    async getArticleTag() {
        const sql = 'select * from tag';
        return await db.query(sql);
    }
    // 通过文章标签加载对应文章
    async getArticleListByTag(uip, tagName, skip, len) {
        const sql = `select
            atc.aid,  DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date, atc.preface, atc.title, atc.cover, tag.tag_name, atc.read_count, count(al.aid) as like_count, (select count(*) from art_like where uip = ? and aid = atc.aid) as is_like
            from article as atc
            left join art_like as al on atc.aid = al.aid
            left join tag on atc.tag_id = tag.tid where tag.tag_name = ?
            group by atc.aid
            order by atc.date desc
            limit ?, ?`;
        return await db.query(sql, [uip, tagName, skip, len]);
    }
    // 关键字搜索文章
    async getArticleBySearch(uip, searchText, skip, len) {
        const sql = `select atc.aid, atc.title, atc.preface , atc.cover, atc.tag_id, atc.type_id, DATE_FORMAT(atc.date, '%Y-%c-%d %H:%i:%s') as date, atc.read_count,
        tag.tag_name, count(al.aid) as like_count, (select count(*) from art_like where uip = ? and aid = atc.aid) as is_like
        from article as atc
        left join art_like as al on atc.aid = al.aid
        left join tag on atc.tag_id = tag.tid
        where atc.title like binary'%${searchText}%' or atc.preface like binary'%${searchText}%' or atc.markdownHtml like binary'%${searchText}%'
        group by atc.aid
        order by atc.date desc
        limit ?, ?`;
        return await db.query(sql, [uip, skip, len]);
    }
    // 关键字搜索总数
    async getArticleTotalBySearch(searchText) {
        const sql = `select count(*) as total from article as atc where atc.title like '%${searchText}%' or atc.preface like '%${searchText}%' or atc.markdownHtml like '%${searchText}%'`;
        return await db.query(sql, [searchText]);
    }
    // 是否点赞
    async isLike(ip, aid) {
        const sql = `select * from art_like where uip = ? and aid = ?`;
        return db.query(sql, [ip, aid]);
    }
    // 点赞
    async givealike(ip, aid, city) {
        const sql = 'insert into art_like (aid, uip, city) values (?, ?, ?);';
        return db.query(sql, [aid, ip, city]);
    }
    // 取消赞
    async cancelalike(ip, aid) {
        const sql = `delete from art_like where uip = ? and aid = ?`;
        return await db.query(sql, [ip, aid]);
    }
    // 赞个数
    async likeCount(aid) {
        const sql = `select count(*) as likeTotal from art_like where aid = ? group by aid`;
        return await db.query(sql, [aid]);
    }
    // 设置阅读总数
    async addArticleReadCount(aid) {
        const sql = `update article set read_count =  read_count + "1" where aid = ?`;
        return await db.query(sql, [aid]);
    }
}
module.exports = articleModel;