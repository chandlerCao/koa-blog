const db = require('../../db');
class articleModel {
    // 获取文章列表
    async getArticleList(ip, skip, len) {
        const sql = `select atc.aid, atc.title, atc.preface, atc.cover, tag.tag_name, atc.date, atc.read_count, count(al.aid) as like_count, (select is_like from art_like where uip = ? and aid = atc.aid) as is_like
        from article as atc
        left join art_like as al on atc.aid = al.aid
        left join tag on atc.tag_id = tag.tid
        group by atc.aid
        order by atc.date desc
        limit ?, ?`;
        const value = [ip, skip, len];
        return await db.query(sql, value);
    }
    // 获取文章总数
    async getArticleTotal() {
        const sql = `select count(*) as total from article`;
        return await db.query(sql);
    }
    // 获取当前tid文章总数
    async getArticleTotalByTid(tid) {
        const sql = `select count(*) as total from article where tag_id = ?`;
        const value = [tid];
        return await db.query(sql, value);
    }
    // 获取文章内容
    async getArticleCnt(ip, aid) {
        const sql = `select atc.*, (select is_like from art_like where aid = ? and uip = ?) as is_like, count(al.aid) as like_count from article as atc
        left join art_like as al on al.aid = ?
        where atc.aid = ?
        group by atc.aid`;
        const value = [aid, ip, aid, aid];
        return await db.query(sql, value);
    }
    // 获取文章标签列表
    async getArticleTag() {
        const sql = 'select * from tag';
        return await db.query(sql);
    }
    // 通过文章标签加载对应文章
    async getArticleListByTag(uip, tid, skip, len) {
        const sql = `select
            atc.aid, atc.date, atc.preface, atc.title, atc.cover, tag.tag_name, atc.read_count, count(al.aid) as like_count, (select is_like from art_like where uip = ? and aid = atc.aid) as is_like
            from article as atc
            left join art_like as al on atc.aid = al.aid
            left join tag on atc.tag_id = tag.tid
            where atc.tag_id = ?
            group by atc.aid
            order by atc.date desc
            limit ?, ?`;
        const value = [uip, tid, skip, len];
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