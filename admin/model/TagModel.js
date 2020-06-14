const db = require('../../db');

class TagModel {
    // 获取标签列表
    async getTagList(searchValue, skip, limit) {
        const sql = `SELECT
            *
        FROM
            tag
        WHERE
            ( tid LIKE BINARY '%${searchValue}%' OR tag_name LIKE BINARY '%${searchValue}%' )
        ORDER BY
            tid
        LIMIT ${skip},${limit}
        `
        return await db.query(sql);
    }
    // 标签总数
    async tagCount(searchValue) {
        const sql = `SELECT
            count(tid) total
        FROM
            tag
        WHERE
            ( tid LIKE BINARY '%${searchValue}%' OR tag_name LIKE BINARY '%${searchValue}%' )
        `
        return await db.query(sql);
    }
    // 获取所有标签
    async getAllTag() {
        const sql = `SELECT
            *
        FROM
            tag
        ORDER BY tid
        `
        return await db.query(sql);
    }
    // 添加标签
    async addTag(tagName) {
        const sql = `insert into tag (tag_name) values (?);`;
        return await db.query(sql, [tagName]);
    }
    // 修改标签
    async updateTag(tid, tagName) {
        const sql = `update tag set tag_name = ? where tid = ?`;
        return await db.query(sql, [tagName, tid]);
    }
    // 删除tag
    async tagDelete(tid) {
        const sql = `delete from tag where tid in ('${tid}')`;
        return await db.query(sql);
    }
    // 获取标签信息
    async getTagByTid(tid) {
        const sql = `select * from tag where tid = '${tid}'`;
        return await db.query(sql);
    }
    // 获取标签信息通过标签名称
    async getTagByTagName(tag_name) {
        const sql = `select * from tag where tag_name = '${tag_name}'`;
        return await db.query(sql);
    }
}
module.exports = TagModel;