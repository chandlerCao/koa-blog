const Router = require('koa-router');
const TagModel = require('../model/TagModel');

const tag = new Router();
tag.post('/tag/getTagList', async c => {
    const tag = new TagModel();
    try {
        const tagList = await tag.getTagList();
        c.body = {
            code: 0,
            tagList,
            msg: 'getTagList success'
        }
    } catch (err) {
        c.body = {
            code: 1,
            msg: err
        }
    }
});

module.exports = tag;