const db = require('../../db');

class TagModel {
    // 获取标签列表
    async getTagList() {
        const sql = 'select * from tag order by tid';
        return await db.query(sql);
    }
    // 添加标签
    async addTag(tagName) {
        const sql = `insert into tag (tag_name) values (?);`;
        return await db.query(sql, [tagName]);
    }
    // 修改标签
    async updTag(tid, tagName) {
        const sql = `update tag set tag_name = ? where tid = ?`;
        return await db.query(sql, [tagName, tid]);
    }
    // 删除tag
    async TagDel(tids) {
        let delItem = '';
        tids.forEach(() => {
            delItem += '?,';
        });
        delItem = delItem.substring(0, delItem.length - 1);
        const sql = `delete from tag where tid in (${delItem})`;
        return await db.query(sql, tids);
    }
    // 获取标签信息
    async getTagByTids(tids) {
        let selItem = '';
        tids.forEach(() => {
            selItem += '?,';
        });
        selItem = selItem.substring(0, selItem.length - 1);
        const sql = `select * from tag where tid in (${selItem})`;
        return await db.query(sql, tids);
    }
}
module.exports = TagModel;