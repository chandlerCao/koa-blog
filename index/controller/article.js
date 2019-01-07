const router = require('koa-router')();
const articleModel = new (require('../model/articleModel'));
const commentModel = new (require('../model/commentModel'));
router.get('/getArticleList', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    let { type, page } = ctx.query;
    if (page) page = parseInt(page);
    else page = 1;
    // 查询限制条数
    const articleLen = ctx.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};
    // 文章列表
    let articleList = await articleModel.getArticleList(ip, type, skip, articleLen);
    articleList.map(articleList => {
        articleList.tag_url = `${ctx.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await articleModel.getArticleTotal(type);
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
router.get('/getArticleCnt', async (ctx, next) => {
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
    await articleModel.addArticleReadCount(aid);
    // 获取文章内容
    const articleInfo = await articleModel.getArticleCnt(aid, ip);
    if (articleInfo.length) {
        const d = articleInfo[0];
        // 获取当前文章评论总数
        const commentCount = await commentModel.getCommentCount(aid);
        d.commentCount = commentCount[0].commentCount;
        // 赋值标签路径
        d.tag_url = `${ctx.icon_dir}/${d.tag_name}`;
        ctx.body = {
            c: 0,
            d
        }
    } else {
        ctx.body = {
            c: 1,
            m: '未找到对应文章！'
        }
    }
});
// 获取所有标签
router.get('/getArticleTag', async (ctx, next) => {
    ctx.body = {
        c: 0,
        d: await articleModel.getArticleTag()
    }
    await next();
});
// 通过标签获取文章列表
router.get('/getArticleListByTag', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    let { tag, page } = ctx.query;
    // 查询限制条数
    const articleLen = ctx.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};

    // 文章列表
    const articleList = await articleModel.getArticleListByTag(ip, tag, skip, articleLen);
    articleList.map(articleList => {
        articleList.tag_url = `${ctx.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await articleModel.getArticleTotalByTag(tag);
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
router.get('/givealike', async (ctx, next) => {
    const ip = ctx.req.connection.remoteAddress;
    const { aid } = ctx.query;
    const isLike = await articleModel.isLike(ip, aid);
    let likeState = -1;
    if (isLike.length === 0) {
        likeState = 1;
        await articleModel.givealike(ip, aid);
    } else {
        likeState = 0;
        await articleModel.cancelalike(ip, aid);
    }
    const likeTotalRes = await articleModel.likeCount(aid);
    // 总赞个数
    const likeTotal = likeTotalRes.length > 0 ? likeTotalRes[0].likeTotal : 0;
    ctx.body = {
        c: 0,
        d: { likeTotal, likeState }
    }
    await next();
});
module.exports = router;