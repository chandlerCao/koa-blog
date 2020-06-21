const db = require('../../db');

class MessageModel {
    // 获取留言列表
    async messageList(searchValue, start_date, end_date, skip, limit) {
        const sql = `SELECT
        *,
        (select count(mid) from message_like where mid = MESSAGE.mid) like_count,
        (select count(rid) from m_reply where mid = MESSAGE.mid) reply_count,
        DATE_FORMAT( date, '%Y-%c-%d %H:%i:%s' ) date
        FROM MESSAGE
    WHERE
        (
            mid LIKE BINARY '%${searchValue}%'
            OR content LIKE BINARY '%${searchValue}%'
            OR USER LIKE BINARY '%${searchValue}%'
        )
        AND ( date BETWEEN '${start_date}' AND '${end_date}' )
    ORDER BY
        date DESC
        LIMIT ${skip},
        ${limit}`;
        return await db.query(sql);
    }
    // 获取留言总数
    async messageCount(searchValue, start_date, end_date) {
        const sql = `SELECT
        count(*) total
    FROM
        MESSAGE
    WHERE
        (
            mid LIKE BINARY '%${searchValue}%'
            OR content LIKE BINARY '%${searchValue}%'
            OR USER LIKE BINARY '%${searchValue}%'
        )
        AND ( date BETWEEN '${start_date}' AND '${end_date}' )
        GROUP BY mid
        `;
        return await db.query(sql);
    }
    // 获取回复列表
    async replyList(searchValue, messageInfo, start_date, end_date, skip, limit) {
        const sql = `SELECT M_REPLY
        .*,
        MESSAGE.content message_content,
        MESSAGE.user message_user,
        (select count(rid) from m_reply_like where rid = M_REPLY.rid) like_count,
        DATE_FORMAT( M_REPLY.date, '%Y-%c-%d %H:%i:%s' ) date
    FROM
        M_REPLY
        LEFT JOIN MESSAGE ON M_REPLY.MID = MESSAGE.MID
    WHERE
        (
            M_REPLY.RID LIKE BINARY '%${searchValue}%'
            OR M_REPLY.CONTENT LIKE BINARY '%${searchValue}%'
            OR M_REPLY.USER LIKE BINARY '%${searchValue}%'
        )
        AND
        (
            MESSAGE.MID LIKE BINARY '%${messageInfo}%'
            OR MESSAGE.CONTENT LIKE BINARY '%${messageInfo}%'
            OR MESSAGE.USER LIKE BINARY '%${messageInfo}%'
        )
        AND ( M_REPLY.DATE BETWEEN '${start_date}' AND '${end_date}' )
    ORDER BY
        M_REPLY.date DESC
        LIMIT ${skip},
        ${limit}`;
        return await db.query(sql);
    }
    // 回复总数
    async replyCount(searchValue, messageInfo, start_date, end_date) {
        const sql = `SELECT
        count(*) total
    FROM
        M_REPLY
        LEFT JOIN MESSAGE ON M_REPLY.MID = MESSAGE.MID
    WHERE
        (
            M_REPLY.RID LIKE BINARY '%${searchValue}%'
            OR M_REPLY.CONTENT LIKE BINARY '%${searchValue}%'
            OR M_REPLY.USER LIKE BINARY '%${searchValue}%'
        )
        AND
        (
            MESSAGE.MID LIKE BINARY '%${messageInfo}%'
            OR MESSAGE.CONTENT LIKE BINARY '%${messageInfo}%'
            OR MESSAGE.USER LIKE BINARY '%${messageInfo}%'
        )
        AND ( M_REPLY.DATE BETWEEN '${start_date}' AND '${end_date}' )
    GROUP BY M_REPLY.RID`;
        return await db.query(sql);
    }
    // 删除留言
    async messageDel(mid) {
        const sql = `delete from MESSAGE where mid in ('${mid}')`;
        return await db.query(sql);
    }
    // 删除回复
    async replyDel(rid) {
        const sql = `delete from M_REPLY where rid in ('${rid}')`;
        return await db.query(sql);
    }
}

module.exports = MessageModel