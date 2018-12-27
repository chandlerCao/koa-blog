const router = require('koa-router')();
const articleModel = require('../model/articleModel');
// 获取文章模型
const article = new articleModel();
// 获取文章列表
router.get('/article/getArticleList', async ctx => {
    const ip = ctx.req.connection.remoteAddress;
    let { type, page } = ctx.query
    if (page) page = parseInt(page);
    else page = 1;
    // 查询限制条数
    const articleLen = ctx.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};
    // 文章列表
    let articleList = await article.getArticleList(ip, type, skip, articleLen);
    articleList.map(articleList => {
        articleList.cover = `${ctx.domain}:${ctx.port}/${articleList.cover}`;
        articleList.tag_url = `${ctx.domain}:${ctx.port}/${ctx.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await article.getArticleTotal(type);
    total = total[0].total;
    data.total = total;

    // 每页显示条数
    data.page_size = articleLen;

    // await async function () {
    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             resolve();
    //         }, 1000);
    //     })
    // }();

    ctx.body = {
        code: 0,
        data,
        msg: 'Successfully get the article list!'
    }
});
// 根据id获取文章内容
router.get('/article/getArticleCnt', async ctx => {
    const ip = ctx.req.connection.remoteAddress;
    const { aid } = ctx.query;
    if (!aid) {
        ctx.body = {
            code: 1,
            msg: '请传递文章id!'
        }
        return;
    }
    // 获取阅读数量
    const read_count = await article.getArticleReadCount(aid);
    // 文章阅读量加一
    await article.setArticleReadCount(aid, ++read_count[0].read_count);
    const articleInfo = await article.getArticleCnt(aid, ip);
    if (articleInfo.length) {
        const articleContent = articleInfo[0];
        articleContent.cover = `${ctx.domain}:${ctx.port}/${articleContent.cover}`;
        articleContent.tag_url = `${ctx.domain}:${ctx.port}/${ctx.icon_dir}/${articleContent.tag_name}`;
        ctx.body = {
            code: 0,
            articleContent,
            msg: 'Successfully get the article content!'
        }
    } else {
        ctx.body = {
            code: 1,
            msg: 'Failed get the article content!'
        }
    }
});
// 获取所有标签
router.get('/article/getArticleTag', async ctx => {
    ctx.body = {
        c: 0,
        m: 'Successfully get the tag list',
        tagList: await article.getArticleTag()
    }
});
// 通过标签获取文章列表
router.get('/article/getArticleListByTag', async ctx => {
    const ip = ctx.req.connection.remoteAddress;
    let { tag, page } = ctx.query;
    // 查询限制条数
    const articleLen = ctx.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};

    // 文章列表
    const articleList = await article.getArticleListByTag(ip, tag, skip, articleLen);
    articleList.map(articleList => {
        articleList.cover = `${ctx.domain}:${ctx.port}/${articleList.cover}`;
        articleList.tag_url = `${ctx.domain}:${ctx.port}/${ctx.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await article.getArticleTotalByTag(tag);
    total = total[0].total;
    data.total = total;

    // 每页显示条数
    data.page_size = articleLen;

    ctx.body = {
        code: 0,
        data,
        msg: 'Successfully get the article list!'
    }
});
// 点赞
router.get('/article/givealike', async ctx => {
    const ip = ctx.req.connection.remoteAddress;
    const { aid } = ctx.query;
    const isLike = await article.isLike(ip, aid);
    if (isLike.length === 0) {
        const likehandle = await article.givealike(ip, aid);
        if (likehandle.affectedRows === 1) {
            ctx.body = {
                code: 0,
                msg: '点赞成功！'
            };
        } else {
            ctx.body = {
                code: 500,
                msg: '操作失败！'
            };
        }
    } else {
        const cancelalike = await article.cancelalike(ip, aid);
        if (cancelalike.affectedRows === 1) {
            ctx.body = {
                code: 1,
                msg: '取消赞！'
            };
        } else {
            ctx.body = {
                code: 500,
                msg: '操作失败！'
            };
        }
    }
});
module.exports = router;