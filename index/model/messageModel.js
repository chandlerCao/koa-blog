const db = require('../../db');

class CommentModel {
    // 添加留言
    async addMessage(...arr) {
        const sql = `insert into message (mid, content, user, uip, city) values (?, ?, ?, ?, ?);`;
        return await db.query(sql, [...arr]);
    }
    // 添加回复
    async addReply(...arr) {
        const sql = `insert into m_reply (rid, mid, content, user, toUser, uip, city) values (?, ?, ?, ?, ?, ?, ?);`;
        return await db.query(sql, [...arr]);
    }
    // 根据留言id，获取留言内容
    async getMessageCnt(mid) {
        const sql = `select message.*,  DATE_FORMAT(message.date, '%Y-%c-%d %H:%i:%s') as date, count(ml.mid) as likeCount from message
        left join message_like as ml on message.mid = ml.mid
        where message.mid = ?`;
        return await db.query(sql, [mid]);
    }
    // 根据回复id，获取回复内容
    async getReplyCnt(rid) {
        const sql = `select m_reply.*, DATE_FORMAT(m_reply.date, '%Y-%c-%d %H:%i:%s') as date, count(mrl.rid) as likeCount from m_reply
        left join m_reply_like as mrl on m_reply.rid = mrl.rid
        where m_reply.rid = ?`;
        return await db.query(sql, [rid]);
    }
    // 获取留言列表
    async getMessageList(ip, skip, limit) {
        const sql = `select message.*, DATE_FORMAT(message.date, '%Y-%c-%d %H:%i:%s') as date, count(ml.mid) as likeCount, (select count(*) from message_like where uip = ? and mid = message.mid) as isLike from message
        left join message_like as ml on message.mid = ml.mid
        group by message.mid
        order by message.date desc
        limit ?, ?`;
        return await db.query(sql, [ip, skip, limit]);
    }
    // 获取回复列表
    async getMReplyList(mid, ip, skip, limit) {
        const sql = `select m_reply.*, DATE_FORMAT(m_reply.date, '%Y-%c-%d %H:%i:%s') as date, count(rl.rid) as likeCount, (select count(*) from m_reply_like where uip = ? and rid = m_reply.rid) as isLike from m_reply
        left join m_reply_like as rl on m_reply.rid = rl.rid
        where m_reply.mid = ?
        group by m_reply.rid
        order by m_reply.date
        limit ?, ?`;
        return await db.query(sql, [ip, mid, skip, limit]);
    }
    // 留言是否点赞
    async messageIsLike(mid, uip) {
        const sql = `select count(*) as isLike from message_like where mid = ? and uip = ?`;
        return await db.query(sql, [mid, uip]);
    }
    // 取消留言点赞
    async cancelMessageLike(mid, uip) {
        const sql = `delete from message_like where mid = ? and uip = ?`;
        return await db.query(sql, [mid, uip]);
    }
    // 取消回复点赞
    async cancelReplyLike(rid, uip) {
        const sql = `delete from m_reply_like where rid = ? and uip = ?`;
        return await db.query(sql, [rid, uip]);
    }
    // 留言点赞
    async giveaMessagelike(mid, uip, city) {
        const sql = `insert into message_like (mid, uip, city) values (?, ?, ?)`;
        return await db.query(sql, [mid, uip, city]);
    }
    // 回复点赞
    async giveaReplylike(rid, uip, city) {
        const sql = `insert into m_reply_like (rid, uip, city) values (?, ?, ?)`;
        return await db.query(sql, [rid, uip, city]);
    }
    // 留言总赞个数
    async MessageLikeCount(mid) {
        const sql = `select count(*) as likeTotal from message_like where mid = ? group by mid`;
        return await db.query(sql, [mid]);
    }
    // 回复总赞个数
    async ReplyLikeCount(rid) {
        const sql = `select count(*) as likeTotal from m_reply_like where rid = ? group by rid`;
        return await db.query(sql, [rid]);
    }
}

module.exports = CommentModel