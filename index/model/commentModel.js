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
        const sql = `select comment.*,  DATE_FORMAT(comment.date, '%Y-%c-%d %H:%i:%s') as date, count(cl.cid) as likeCount from comment
        left join comment_like as cl on comment.cid = cl.cid
        where comment.cid = ?`;
        return await db.query(sql, [cid]);
    }
    // 根据回复id，获取回复内容
    async getReplyCnt(rid) {
        const sql = `select reply.*, DATE_FORMAT(reply.date, '%Y-%c-%d %H:%i:%s') as date, count(rl.rid) as likeCount from reply
        left join reply_like as rl on reply.rid = rl.rid
        where reply.rid = ?`;
        return await db.query(sql, [rid]);
    }
    // 获取评论列表
    async getCommentList(aid, ip, skip, limit) {
        const sql = `select comment.*, DATE_FORMAT(comment.date, '%Y-%c-%d %H:%i:%s') as date, count(cl.cid) as likeCount, (select count(*) from comment_like where uip = ? and cid = comment.cid) as isLike from comment
        left join comment_like as cl on comment.cid = cl.cid
        where comment.aid = ?
        group by comment.cid
        order by comment.date desc
        limit ?, ?`;
        return await db.query(sql, [ip, aid, skip, limit]);
    }
    // 获取回复列表
    async getReplyList(cid, ip, skip, limit) {
        const sql = `select reply.*, DATE_FORMAT(reply.date, '%Y-%c-%d %H:%i:%s') as date, count(rl.rid) as likeCount, (select count(*) from reply_like where uip = ? and rid = reply.rid) as isLike from reply
        left join reply_like as rl on reply.rid = rl.rid
        where reply.cid = ?
        group by reply.rid
        order by reply.date
        limit ?, ?`;
        return await db.query(sql, [ip, cid, skip, limit]);
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
    async cancelCommentLike(cid, uip) {
        const sql = `delete from comment_like where cid = ? and uip = ?`;
        return await db.query(sql, [cid, uip]);
    }
    // 取消回复点赞
    async cancelReplyLike(rid, uip) {
        const sql = `delete from reply_like where rid = ? and uip = ?`;
        return await db.query(sql, [rid, uip]);
    }
    // 评论点赞
    async giveaCommentlike(cid, uip, city) {
        const sql = `insert into comment_like (cid, uip, city) values (?, ?, ?)`;
        return await db.query(sql, [cid, uip, city]);
    }
    // 回复点赞
    async giveaReplylike(rid, uip, city) {
        const sql = `insert into reply_like (rid, uip, city) values (?, ?, ?)`;
        return await db.query(sql, [rid, uip, city]);
    }
    // 评论总赞个数
    async CommentLikeCount(cid) {
        const sql = `select count(*) as likeTotal from comment_like where cid = ? group by cid`;
        return await db.query(sql, [cid]);
    }
    // 回复总赞个数
    async ReplyLikeCount(rid) {
        const sql = `select count(*) as likeTotal from reply_like where rid = ? group by rid`;
        return await db.query(sql, [rid]);
    }
}

module.exports = CommentModel