const db = require('../../db');

class TagModel {
    async getTagList() {
        const sql = 'select * from tag';
        return await db.query(sql);
    }
    // 添加biaoq
    async addTag(tagName) {
        const sql = `insert into tag (tag_name) values (?);`;
        return await db.query(sql, [tagName]);
    }
}
module.exports = TagModel;