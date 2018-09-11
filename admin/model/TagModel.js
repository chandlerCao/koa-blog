const db = require('../../db');

class TagModel {
    async getTagList() {
        const sql = 'select * from tag';
        return await db.query(sql);
    }
}
module.exports = TagModel;