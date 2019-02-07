const Router = require('koa-router');
const TagModel = require('../model/TagModel');

const tag = new Router();
tag.post('/tag/getTagList', async ctx => {
    const tag = new TagModel();
    try {
        const tagList = await tag.getTagList();
        ctx.body = {
            c: 0,
            d: tagList
        }
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '获取标签失败！'
        }
    }
});

module.exports = tag;