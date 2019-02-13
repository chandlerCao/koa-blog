const router = require('koa-router')();
const articleModel = new (require('../model/articleModel'));
const commentModel = new (require('../model/commentModel'));

const indexConfig = require('../index.config');
router.get('/getArticleList', async (ctx, next) => {
    const { ip, icon_dir } = ctx.state;
    let { type, page } = ctx.query;
    if (page) page = parseInt(page);
    else page = 1;
    // 查询限制条数
    const articleLen = indexConfig.articleLen;
    const skip = (page - 1) * articleLen;
    const d = {};
    // 文章列表
    const articleList = await articleModel.getArticleList(ip, type, skip, articleLen);
    articleList.map(articleList => {
        articleList.tag_url = `${icon_dir}/${articleList.tag_name}`;
    });
    d.articleList = articleList;
    // 文章总数
    const total = await articleModel.getArticleTotal(type);
    d.total = total[0].total;
    // 每页显示条数
    d.page_size = articleLen;
    ctx.body = {
        c: 0,
        d
    }
    await next();
});
// 根据id获取文章内容
router.get('/getArticleCnt', async ctx => {
    const { ip } = ctx.state;
    const { aid } = ctx.query;
    if (!aid) {
        ctx.body = {
            c: 1,
            m: '请传递文章id!'
        }
        return false;
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
        d.tag_url = `${ctx.state.icon_dir}/${d.tag_name}`;
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
router.get('/getArticleTag', async ctx => {
    ctx.body = {
        c: 0,
        d: await articleModel.getArticleTag()
    }
});
// 通过标签获取文章列表
router.get('/getArticleListByTag', async ctx => {
    const { ip } = ctx.state;
    let { tag, page } = ctx.query;
    // 查询限制条数
    const articleLen = indexConfig.articleLen;
    const skip = (page - 1) * articleLen;
    const d = {};

    // 文章列表
    const articleList = await articleModel.getArticleListByTag(ip, tag, skip, articleLen);
    articleList.map(articleList => {
        articleList.tag_url = `${ctx.state.icon_dir}/${articleList.tag_name}`;
    });
    d.articleList = articleList;

    // 文章总数
    let total = await articleModel.getArticleTotalByTag(tag);
    total = total[0].total;
    d.total = total;

    // 每页显示条数
    d.page_size = articleLen;

    ctx.body = {
        c: 0,
        d
    }
});
// 点赞
router.get('/givealike', async ctx => {
    const { ip, city } = ctx.state;
    console.log(ip);
    const { aid } = ctx.query;
    const isLike = await articleModel.isLike(ip, aid);
    let likeState = -1;
    if (isLike.length === 0) {
        likeState = 1;
        await articleModel.givealike(ip, aid, city);
    } else {
        likeState = 0;
        await articleModel.cancelalike(ip, aid);
    }
    // 总赞个数
    const likeTotalRes = await articleModel.likeCount(aid);
    const likeTotal = likeTotalRes.length > 0 ? likeTotalRes[0].likeTotal : 0;
    ctx.body = {
        c: 0,
        d: { likeTotal, likeState }
    }
});
module.exports = router;