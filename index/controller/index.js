const router = require('koa-router')();
const articleModel = require('../model/articleModel');
const getClientIP = require('../../utils/getClientIP');
// 获取文章模型
const article = new articleModel();
// 查询数量
const articleLen = 10;
// 获取文章列表
router.post('/getArticleList', async c => {
    let {page} = c.request.body;
    if( page ) page = parseInt(page);
    else page = 1;
    const skip = (page - 1) * articleLen;
    let articleList = await article.getArticleList(articleLen, skip);
    c.body = {
        code: 0,
        articleList,
        msg: 'getArticleList success!'
    }
});
// 根据id获取文章内容
router.post('/getArticleCnt', async c => {
    const {aid} = c.request.body;
    if( !aid ) {
        c.body = {
            code: 1,
            msg: '请传递文章id!'
        }
        return;
    }
    const articleInfo = await article.getArticleCnt(aid);
    if(articleInfo.length) {
        c.body = {
            code: 0,
            articleInfo,
        }
    } else {
        c.body = {
            code: 1,
            msg: 'not found'
        }
    }
});
// 点赞
router.post('/article-like', async c => {
    const ip = getClientIP(c.req);
});
module.exports = router;