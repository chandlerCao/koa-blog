const db = require('../../db');

class CommentModel {
    // 添加评论
    async addComment(...arr) {
        const sql = `
            insert into comment (cid, comment_text, comment_user, aid, uip, city) values (?, ?, ?, ?, ?, ?);
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
    // 获取当前文章评论总数
    async getCommentCount(aid) {
        const sql = `select count(*) as commentCount from comment where aid = ?`;
        return await db.query(sql, [aid]);
    }
}

module.exports = CommentModel