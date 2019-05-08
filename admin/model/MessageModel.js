const db = require('../../db');

class MessageModel {
    // 根据留言id，获取留言内容
    async getMessageCnt(mid) {
        const sql = `select message.*,  DATE_FORMAT(message.date, '%Y-%c-%d %H:%i:%s') as date, count(ml.mid) as likeCount from message
        left join message_like as ml on message.mid = ml.mid
        where message.mid = ?`;
        return await db.query(sql, [mid]);
    }
    // 根据回复id，获取回复内容
    async getReplyCnt(rid) {
        const sql = `select m_reply.*, DATE_FORMAT(m_reply.date, '%Y-%c-%d %H:%i:%s') as date, count(rl.rid) as likeCount from m_reply
        left join m_reply_like as rl on m_reply.rid = rl.rid
        where m_reply.rid = ?`;
        return await db.query(sql, [rid]);
    }
    // 获取留言列表
    async getMessageList(skip, limit) {
        const sql = `select message.*, DATE_FORMAT(message.date, '%Y-%c-%d %H:%i:%s') as date, count(ml.mid) as likeCount from message
        left join message_like as ml on message.mid = ml.mid
        group by message.mid
        order by message.date desc
        limit ?, ?`;
        return await db.query(sql, [skip, limit]);
    }
    // 获取留言总数
    async getMessageCount() {
        const sql = `select count(*) as messageCount from message`;
        return await db.query(sql);
    }
    // 获取回复列表
    async getReplyList(mid, skip, limit) {
        const sql = `select m_reply.*, DATE_FORMAT(m_reply.date, '%Y-%c-%d %H:%i:%s') as date, count(rl.rid) as likeCount from m_reply
        left join m_reply_like as rl on m_reply.rid = rl.rid
        where m_reply.mid = ?
        group by m_reply.rid
        order by m_reply.date
        limit ?, ?`;
        return await db.query(sql, [mid, skip, limit]);
    }
    // 回复总数
    async getReplyCount(mid) {
        const sql = `select count(*) as m_replyCount from m_reply where mid = ?`;
        return await db.query(sql, [mid]);
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
    // 删除留言
    async messageDel(mids) {
        let midsStr = mids.concat([]).fill('?').join(',');
        const sql = `delete from message where mid in (${midsStr})`;
        return await db.query(sql, mids);
    }
    // 删除回复
    async m_replyDel(rids) {
        let ridsStr = rids.concat([]).fill('?').join(',');
        const sql = `delete from m_reply where rid in (${ridsStr})`;
        return await db.query(sql, rids);
    }
}

module.exports = MessageModel