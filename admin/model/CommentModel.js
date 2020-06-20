const db = require('../../db');

class CommentModel {
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
    async commentList(searchValue, articleInfo, start_date, end_date, skip, limit) {
        const sql = `SELECT COMMENT
        .*, article.title article_title,
        (select count(cid) from comment_like where cid = COMMENT.cid) like_count,
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
    async getReplyList(cid, skip, limit) {
        const sql = `select reply.*, DATE_FORMAT(reply.date, '%Y-%c-%d %H:%i:%s') as date, count(rl.rid) as likeCount from reply
        left join reply_like as rl on reply.rid = rl.rid
        where reply.cid = ?
        group by reply.rid
        order by reply.date
        limit ?, ?`;
        return await db.query(sql, [cid, skip, limit]);
    }
    // 回复总数
    async getReplyCount(cid) {
        const sql = `select count(*) as replyCount from reply where cid = ?`;
        return await db.query(sql, [cid]);
    }
    // 获取当前文章评论总数
    async getCommentCountByAid(aid) {
        const sql = `select count(*) as commentCount from comment where aid = ?`;
        return await db.query(sql, [aid]);
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
    // 删除评论
    async commentDel(cids) {
        let cidsStr = cids.concat([]).fill('?').join(',');
        const sql = `delete from comment where cid in (${cidsStr})`;
        return await db.query(sql, cids);
    }
    // 删除回复
    async replyDel(rids) {
        let ridsStr = rids.concat([]).fill('?').join(',');
        const sql = `delete from reply where rid in (${ridsStr})`;
        return await db.query(sql, rids);
    }
}

module.exports = CommentModel