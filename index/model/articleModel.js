const db = require('../../db');
class articleModel {
    // 获取文章列表
    async getArticleList(ip, type, skip, len) {
        const sql = `select atc.aid, atc.title, atc.preface, atc.cover, tag.tag_name, atc.date, atc.read_count, count(al.aid) as like_count, (select is_like from art_like where uip = ? and aid = atc.aid) as is_like
        from article as atc
        left join art_like as al on atc.aid = al.aid
        left join tag on atc.tag_id = tag.tid
        left join type on atc.type_id = type.type_id where type.type_text = ?
        group by atc.aid
        order by atc.date desc
        limit ?, ?`;
        const value = [ip, type, skip, len];
        return await db.query(sql, value);
    }
    // 获取文章总数
    async getArticleTotal(type) {
        const sql = `select count(*) as total from article
        left join type on article.type_id = type.type_id where type.type_text = ?
        `;
        const value = [type];
        return await db.query(sql, value);
    }
    // 获取当前标签名称获取文章总数
    async getArticleTotalByTag(tagname) {
        const sql = `select count(*) as total from article
        left join tag on article.tag_id = tag.tid where tag.tag_name = ?`;
        const value = [tagname];
        return await db.query(sql, value);
    }
    // 获取文章内容
    async getArticleCnt(aid) {
        const sql = `select atc.*, count(al.aid) as like_count from article as atc
        left join art_like as al on al.aid = ?
        where atc.aid = ?
        group by atc.aid`;
        const value = [aid, aid];
        return await db.query(sql, value);
    }
    // 获取文章标签列表
    async getArticleTag() {
        const sql = 'select * from tag';
        return await db.query(sql);
    }
    // 通过文章标签加载对应文章
    async getArticleListByTag(uip, tagname, skip, len) {
        const sql = `select
            atc.aid, atc.date, atc.preface, atc.title, atc.cover, tag.tag_name, atc.read_count, count(al.aid) as like_count, (select is_like from art_like where uip = ? and aid = atc.aid) as is_like
            from article as atc
            left join art_like as al on atc.aid = al.aid
            left join tag on atc.tag_id = tag.tid where tag.tag_name = ?
            group by atc.aid
            order by atc.date desc
            limit ?, ?`;
        const value = [uip, tagname, skip, len];
        return await db.query(sql, value);
    }
    // 是否点赞
    async isLike(ip, aid) {
        const sql = `select * from art_like where uip = ? and aid = ? and is_like = 1`;
        const value = [ip, aid];
        return db.query(sql, value);
    }
    // 点赞
    async givealike(ip, aid) {
        const sql = 'insert into art_like (aid, uip, is_like) values (?, ?, 1);';
        const value = [aid, ip];
        return db.query(sql, value);
    }
    // 取消赞
    async cancelalike(ip, aid) {
        const sql = `delete from art_like where uip = ? and aid = ?`;
        const value = [ip, aid];
        return await db.query(sql, value);
    }
    // 获取文章阅读总数
    async getArticleReadCount(aid) {
        const sql = `select read_count from article where aid = ?`;
        const value = [aid];
        return await db.query(sql, value);
    }
    // 设置阅读总数
    async setArticleReadCount(aid, read_count) {
        const sql = `update article set read_count = ? where aid = ?`;
        const value = [read_count, aid];
        return await db.query(sql, value);
    }
}
module.exports = articleModel;