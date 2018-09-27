const router = require('koa-router')();
const articleModel = require('../model/articleModel');
// 获取文章模型
const article = new articleModel();
// 查询数量
const articleLen = 10;

router.post('/getArticleList', async c => {
    let {page} = c.request.body;
    if( page ) page = parseInt(page);
    else page = 1;
    const skip = (page - 1) * articleLen;
    let articleList = await article.getArticleList(articleLen, skip);
    // 图片地址
    // 获取服务器地址
    const {host} = c.request;
    articleList.map(articleItem => {
        articleItem.imgSrc = `http://${host}/article-img/${articleItem.aid}.png`;
    });
    c.body = {
        code: 0,
        articleList,
        msg: 'article list success!'
    }
});
// 根据id获取文章内容
router.post('/getArticleByHash', async c => {
    const {aid} = c.request.body;
    if( !aid ) {
        c.body = {
            code: 1,
            msg: '查询失败！'
        }
        return;
    }
    const articleInfo = await article.getArticleByHash(aid);
    c.body = {
        code: 0,
        articleInfo,
        msg: 'getArticleInfo is success'
    }
});
module.exports = router;