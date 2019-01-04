const router = require('koa-router')();
const articleModel = require('../model/articleModel');
// 获取文章模型
const article = new articleModel();
// 获取文章列表
router.get('/article/getArticleList', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    let { type, page } = ctx.query;
    if (page) page = parseInt(page);
    else page = 1;
    // 查询限制条数
    const articleLen = ctx.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};
    // 文章列表
    let articleList = await article.getArticleList(ip, type, skip, articleLen);
    articleList.map(articleList => {
        articleList.tag_url = `${ctx.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await article.getArticleTotal(type);
    total = total[0].total;
    data.total = total;

    // 每页显示条数
    data.page_size = articleLen;

    ctx.body = {
        c: 0,
        d: data
    }
    await next();
});
// 根据id获取文章内容
router.get('/article/getArticleCnt', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    const { aid } = ctx.query;
    if (!aid) {
        ctx.body = {
            c: 1,
            m: '请传递文章id!'
        }
        return;
    }
    // 文章阅读量加一
    await article.addArticleReadCount(aid);
    const articleInfo = await article.getArticleCnt(aid, ip);
    if (articleInfo.length) {
        const articleContent = articleInfo[0];
        articleContent.tag_url = `${ctx.icon_dir}/${articleContent.tag_name}`;
        ctx.body = {
            c: 0,
            d: articleContent
        }
    } else {
        ctx.body = {
            c: 1,
            m: '未找到对应文章！'
        }
    }
});
// 获取所有标签
router.get('/article/getArticleTag', async (ctx, next) => {
    ctx.body = {
        c: 0,
        d: await article.getArticleTag()
    }
    await next();
});
// 通过标签获取文章列表
router.get('/article/getArticleListByTag', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    let { tag, page } = ctx.query;
    // 查询限制条数
    const articleLen = ctx.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};

    // 文章列表
    const articleList = await article.getArticleListByTag(ip, tag, skip, articleLen);
    articleList.map(articleList => {
        articleList.tag_url = `${ctx.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await article.getArticleTotalByTag(tag);
    total = total[0].total;
    data.total = total;

    // 每页显示条数
    data.page_size = articleLen;

    ctx.body = {
        c: 0,
        d: data
    }
    await next();
});
// 点赞
router.get('/article/givealike', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    const { aid } = ctx.query;
    const isLike = await article.isLike(ip, aid);
    if (isLike.length === 0) {
        await article.givealike(ip, aid);
    } else {
        await article.cancelalike(ip, aid);
    }
    const likeTotalRes = await article.likeCount(aid);
    // 总赞个数
    const likeTotal = likeTotalRes.length > 0 ? likeTotalRes[0].likeTotal : 0;
    ctx.body = {
        c: 0,
        d: likeTotal
    }
    await next();
});
module.exports = router;