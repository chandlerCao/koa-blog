const db = require('../../db');
class ArticleModel {
    // 文章添加
    async articleAdd() {
        const sql = `insert into article (aid, title, preface, cover, tag_id, state, markdownTxt, content, type_id) values (?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        return await db.query(sql, [...arguments]);
    }
    // 获取文章列表
    async articleList(searchValue, state, tag, start_date, end_date, skip, limit) {
        const sql = `SELECT
        atc.*,
        tag.tag_name,
        (select count(aid) from art_like al where aid = atc.aid) as like_count,
	    (select count(aid) from comment where aid = atc.aid) as comment_count,
        DATE_FORMAT( atc.date, '%Y-%c-%d %H:%i:%s' ) date
    FROM
        article atc
        LEFT JOIN tag ON atc.tag_id = tag.tid
        LEFT JOIN art_like al ON atc.aid = al.aid
        LEFT JOIN comment ON atc.aid = comment.aid
    WHERE
        atc.state = ${state}
        AND state <> -1
        AND tag.tid = ${tag}
        AND (
            atc.aid LIKE BINARY '%${searchValue}%'
            OR atc.title LIKE BINARY '%${searchValue}%'
            OR atc.preface LIKE BINARY '%${searchValue}%'
            OR atc.content LIKE BINARY '%${searchValue}%'
        )
        AND ( atc.date BETWEEN '${start_date}' AND '${end_date}' )
    GROUP BY
        atc.aid
    ORDER BY
        atc.date DESC
        LIMIT ${skip},
        ${limit}`;
        return await db.query(sql);
    }
    // 获取文章回收站列表
    async dustbinList(searchValue, tag, start_date, end_date, skip, limit) {
        const sql = `SELECT
        atc.*,
        tag.tag_name,
        (select count(aid) from art_like al where aid = atc.aid) as like_count,
	    (select count(aid) from comment where aid = atc.aid) as comment_count,
        DATE_FORMAT( atc.date, '%Y-%c-%d %H:%i:%s' ) date
    FROM
        article atc
        LEFT JOIN tag ON atc.tag_id = tag.tid
        LEFT JOIN art_like al ON atc.aid = al.aid
        LEFT JOIN comment ON atc.aid = comment.aid
    WHERE
        atc.state = -1
        AND tag.tid = ${tag}
        AND (
            atc.aid LIKE BINARY '%${searchValue}%'
            OR atc.title LIKE BINARY '%${searchValue}%'
            OR atc.preface LIKE BINARY '%${searchValue}%'
            OR atc.content LIKE BINARY '%${searchValue}%'
        )
        AND ( atc.date BETWEEN '${start_date}' AND '${end_date}' )
    GROUP BY
        atc.aid
    ORDER BY
        atc.date DESC
        LIMIT ${skip},
        ${limit}`;
        return await db.query(sql);
    }
    // 文章总数
    async articleCount(searchValue, state, tag, start_date, end_date) {
        const sql = `SELECT
        count(*) total
    FROM
        article atc
        LEFT JOIN tag ON atc.tag_id = tag.tid
    WHERE
        atc.state = ${state}
        AND state <> -1
        AND tag.tid = ${tag}
        AND (
            atc.aid LIKE BINARY '%${searchValue}%'
            OR atc.title LIKE BINARY '%${searchValue}%'
            OR atc.preface LIKE BINARY '%${searchValue}%'
            OR atc.content LIKE BINARY '%${searchValue}%'
        )
        AND ( atc.date BETWEEN '${start_date}' AND '${end_date}' )`;
        return await db.query(sql);
    }
    // 回收站总数
    async dustbinCount(searchValue, tag, start_date, end_date) {
        const sql = `SELECT
        count(*) total
    FROM
        article atc
        LEFT JOIN tag ON atc.tag_id = tag.tid
    WHERE
        atc.state = -1
        AND tag.tid = ${tag}
        AND (
            atc.aid LIKE BINARY '%${searchValue}%'
            OR atc.title LIKE BINARY '%${searchValue}%'
            OR atc.preface LIKE BINARY '%${searchValue}%'
            OR atc.content LIKE BINARY '%${searchValue}%'
        )
        AND ( atc.date BETWEEN '${start_date}' AND '${end_date}' )`;
        return await db.query(sql);
    }
    // 获取文章内容
    async articleContentByAid() {
        const sql = `select aid, title, preface, cover, tag_id, markdownTxt, content, state from article where aid = ?`;
        return await db.query(sql, [...arguments]);
    }
    // 更新文章
    async articleUpdate() {
        const sql = `update article set title = ?, preface = ?, cover = ?, tag_id = ?, markdownTxt = ?, content = ?, state = ? where aid = ?`;
        return await db.query(sql, [...arguments]);
    }
    // 判断文章是否存在
    async articleExists() {
        const sql = `select * from article where aid = ?`;
        return await db.query(sql, [...arguments]);
    }
    // 删除文章
    async articleDel(aid) {
        const sql = `delete from article where aid in ('${aid}')`;
        return await db.query(sql);
    }
    // 文章回收站
    async articleDustbin(aid) {
        const sql = `update article set state = -1 where aid in ('${aid}')`;
        return await db.query(sql);
    }
    // 文章恢复至草稿箱
    async articleRecovery(aid) {
        const sql = `update article set state = 0 where aid in ('${aid}')`;
        return await db.query(sql);
    }
}
module.exports = ArticleModel;