const db = require('../../db');

class CommentModel {
    // 获取评论列表
    async commentList(searchValue, articleInfo, start_date, end_date, skip, limit) {
        const sql = `SELECT COMMENT
        .*, article.title article_title,
        (select count(cid) from comment_like where cid = COMMENT.cid) like_count,
        (select count(rid) from reply where cid = COMMENT.cid) reply_count,
        DATE_FORMAT( COMMENT.date, '%Y-%c-%d %H:%i:%s' ) date
    FROM
        COMMENT LEFT JOIN article ON COMMENT.aid = article.aid
    WHERE
        (
            COMMENT.cid LIKE BINARY '%${searchValue}%'
            OR COMMENT.content LIKE BINARY '%${searchValue}%'
            OR COMMENT.USER LIKE BINARY '%${searchValue}%'
        )
        AND
        (
            ARTICLE.aid LIKE BINARY '%${articleInfo}%'
            OR ARTICLE.title LIKE BINARY '%${articleInfo}%'
        )
        AND ( COMMENT.date BETWEEN '${start_date}' AND '${end_date}' )
    ORDER BY
        COMMENT.date DESC
        LIMIT ${skip},
        ${limit}`;
        return await db.query(sql);
    }
    // 获取评论总数
    async commentCount(searchValue, articleInfo, start_date, end_date) {
        const sql = `SELECT
        count(*) total
    FROM
        COMMENT LEFT JOIN article ON COMMENT.aid = article.aid
    WHERE
        (
            COMMENT.cid LIKE BINARY '%${searchValue}%'
            OR COMMENT.content LIKE BINARY '%${searchValue}%'
            OR COMMENT.USER LIKE BINARY '%${searchValue}%'
        )
        AND
        (
            ARTICLE.aid LIKE BINARY '%${articleInfo}%'
            OR ARTICLE.title LIKE BINARY '%${articleInfo}%'
        )
        AND ( COMMENT.date BETWEEN '${start_date}' AND '${end_date}' )
        GROUP BY COMMENT.cid
        `;
        return await db.query(sql);
    }
    // 获取回复列表
    async replyList(searchValue, commentInfo, articleInfo, start_date, end_date, skip, limit) {
        const sql = `SELECT REPLY
        .*,
        COMMENT.content comment_content,
        COMMENT.user comment_user,
        article.title article_title,
        (select count(rid) from reply_like where rid = REPLY.rid) like_count,
        DATE_FORMAT( REPLY.date, '%Y-%c-%d %H:%i:%s' ) date
    FROM
        REPLY
        LEFT JOIN COMMENT ON REPLY.cid = COMMENT.cid
        LEFT JOIN ARTICLE ON REPLY.aid = ARTICLE.aid
    WHERE
        (
            REPLY.RID LIKE BINARY '%${searchValue}%'
            OR REPLY.CONTENT LIKE BINARY '%${searchValue}%'
            OR REPLY.USER LIKE BINARY '%${searchValue}%'
        )
        AND
        (
            COMMENT.CID LIKE BINARY '%${commentInfo}%'
            OR COMMENT.CONTENT LIKE BINARY '%${commentInfo}%'
            OR COMMENT.USER LIKE BINARY '%${commentInfo}%'
        )
        AND
        (
            ARTICLE.AID LIKE BINARY '%${articleInfo}%'
            OR ARTICLE.TITLE LIKE BINARY '%${articleInfo}%'
        )
        AND ( REPLY.DATE BETWEEN '${start_date}' AND '${end_date}' )
    ORDER BY
        REPLY.date DESC
        LIMIT ${skip},
        ${limit}`;
        return await db.query(sql);
    }
    // 回复总数
    async replyCount(searchValue, commentInfo, articleInfo, start_date, end_date) {
        const sql = `SELECT
        count(*) total
    FROM
        REPLY
        LEFT JOIN COMMENT ON REPLY.cid = COMMENT.cid
        LEFT JOIN ARTICLE ON REPLY.aid = ARTICLE.aid
    WHERE
        (
            REPLY.RID LIKE BINARY '%${searchValue}%'
            OR REPLY.CONTENT LIKE BINARY '%${searchValue}%'
            OR REPLY.USER LIKE BINARY '%${searchValue}%'
        )
        AND
        (
            COMMENT.CID LIKE BINARY '%${commentInfo}%'
            OR COMMENT.CONTENT LIKE BINARY '%${commentInfo}%'
            OR COMMENT.USER LIKE BINARY '%${commentInfo}%'
        )
        AND
        (
            ARTICLE.AID LIKE BINARY '%${articleInfo}%'
            OR ARTICLE.TITLE LIKE BINARY '%${articleInfo}%'
        )
        AND ( REPLY.DATE BETWEEN '${start_date}' AND '${end_date}' )
        GROUP BY REPLY.RID
        `;
        return await db.query(sql);
    }
    // 删除评论
    async commentDel(cid) {
        const sql = `delete from comment where cid in ('${cid}')`;
        return await db.query(sql);
    }
    // 删除回复
    async replyDel(rid) {
        const sql = `delete from reply where rid in ('${rid}')`;
        return await db.query(sql);
    }
}

module.exports = CommentModel