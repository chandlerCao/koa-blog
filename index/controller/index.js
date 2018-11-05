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
    articleList.map(articleList => {
        articleList.cover = `${c.domain}:${c.port}${articleList.cover}`;
        articleList.tag_url = `${c.domain}:${c.port}/${c.icon_dir}/${articleList.tag_name}`;
    });
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
    articleInfo[0].domain = `${c.domain}:${c.port}`;
    if(articleInfo.length) {
        c.body = {
            code: 0,
            articleInfo: articleInfo[0]
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