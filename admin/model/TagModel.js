const db = require('../../db');

class TagModel {
    // 获取标签列表
    async getTagList() {
        const sql = 'select * from tag order by tid';
        return await db.query(sql);
    }
    // 添加g标签
    async addTag(tagName) {
        const sql = `insert into tag (tag_name) values (?);`;
        return await db.query(sql, [tagName]);
    }
    // 删除tag
    async TagDel(tids) {
        let delitem = '';
        tids.forEach(() => {
            delitem += '?,';
        });
        delitem = delitem.substring(0, delitem.length - 1);
        const sql = `delete from tag where tid in (${delitem})`;
        return await db.query(sql, [...tids]);
    }
    // 获取标签信息
    async getTagByTid(tid) {
        const sql = `select * from tag where tid = ?`;
        return await db.query(sql, [tid]);
    }
}
module.exports = TagModel;