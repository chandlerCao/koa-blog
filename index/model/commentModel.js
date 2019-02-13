const db = require('../../db');

class CommentModel {
    // 添加评论
    async addComment(...arr) {
        const sql = `
            insert into comment (cid, content, user, aid, uip, city) values (?, ?, ?, ?, ?, ?);
        `;
        return await db.query(sql, [...arr]);
    }
    // 添加回复
    async addReply(...arr) {
        const sql = `
            insert into reply (rid, cid, content, user, toUser, aid, uip, city) values (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        return await db.query(sql, [...arr]);
    }
    // 根据评论id，获取评论内容
    async getCommentCnt(cid) {
        const sql = `select comment.*, count(cl.cid) as likeCount from comment
        left join comment_like as cl on comment.cid = cl.cid
        where comment.cid = ?`;
        return await db.query(sql, [cid]);
    }
    // 根据回复id，获取回复内容
    async getReplyCnt(rid) {
        const sql = `select * from reply where rid = ?`;
        return await db.query(sql, [rid]);
    }
    // 获取评论列表
    async getCommentList(aid, ip, skip, limit) {
        const sql = `select comment.*, count(cl.cid) as likeCount, (select count(*) from comment_like where uip = ? and cid = comment.cid) as isLike from comment
        left join comment_like as cl on comment.cid = cl.cid
        where comment.aid = ?
        group by comment.cid
        order by date desc
        limit ?, ?`;
        return await db.query(sql, [ip, aid, skip, limit]);
    }
    // 获取回复列表
    async getReplyList(cid, ip, skip, limit) {
        const sql = `select reply.* from reply
        where cid = ?
        order by date
        limit ?, ?`;
        return await db.query(sql, [cid, skip, limit]);
    }
    // 获取当前文章评论总数
    async getCommentCount(aid) {
        const sql = `select count(*) as commentCount from comment where aid = ?`;
        return await db.query(sql, [aid]);
    }
    // 评论是否点赞
    async commentIsLike(cid, uip) {
        const sql = `select count(*) as isLike from comment_like where cid = ? and uip = ?`;
        return await db.query(sql, [cid, uip]);
    }
    // 取消评论点赞
    async cancelLike(cid, uip) {
        const sql = `delete from comment_like where cid = ? and uip = ?`;
        return await db.query(sql, [cid, uip]);
    }
    // 评论点赞
    async givealike(cid, uip, city) {
        const sql = `insert into comment_like (cid, uip, city) values (?, ?, ?)`;
        return await db.query(sql, [cid, uip, city]);
    }
    // 评论总赞个数
    async likeCount(cid) {
        const sql = `select count(*) as likeTotal from comment_like where cid = ? group by cid`;
        return await db.query(sql, [cid]);
    }
}

module.exports = CommentModel