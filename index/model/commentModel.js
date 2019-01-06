const db = require('../../db');

class CommentModel {
    // 添加评论
    async addComment(...arr) {
        const sql = `
            insert into comment (comment_id, comment_text, comment_user, aid, uip, city) values (?, ?, ?, ?, ?, ?);
        `;
        const values = [...arguments];
        return await db.query(sql, values);
    }
    // 根据评论id，获取评论内容
    async getCommentCnt(comment_id) {
        const sql = `select * from comment where comment_id = ?`;
        const values = [comment_id];
        return await db.query(sql, values);
    }
    // 获取评论列表
    async getCommentList(aid) {
        const sql = `select * from comment where aid = ? order by comment_date desc`;
        const values = [aid];
        return await db.query(sql, values);
    }
}

module.exports = CommentModel