const router = require('koa-router')();
const TagModel = require('../model/TagModel');

router.post('/admin/getTagList', async c => {
    const tag = new TagModel();
    const tagList = await tag.getTagList();
    c.body = {
        code: 0,
        tagList, 
        msg: '获取列表成功！'
    }
});

module.exports = router;