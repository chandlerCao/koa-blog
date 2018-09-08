const router = require('koa-router')();
router.post('/addArticle', async c => {
    // const {id, content} = c.request.body;
    console.log( c.request.body );
    c.body = {
        code: 0,
        msg: '添加成功！'
    }
});
module.exports = router