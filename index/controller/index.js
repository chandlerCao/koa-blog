const router = require('koa-router')();
const articleModel = require('../model/articleModel');
const querystring = require('querystring');
const fs = require('fs');
// 获取文章模型
const article = new articleModel();
// 获取文章列表
router.get('', async c => {
    const indexPage = fs.readFileSync('../view/index.html').toString();
    c.body = indexPage;
});
router.get('/article/getArticleList', async c => {
    const ip = c.req.connection.remoteAddress;
    let { type, page } = c.query
    if (page) page = parseInt(page);
    else page = 1;
    // 查询限制条数
    const articleLen = c.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};
    // 文章列表
    let articleList = await article.getArticleList(ip, type, skip, articleLen);
    articleList.map(articleList => {
        articleList.cover = `${c.domain}:${c.port}/${articleList.cover}`;
        articleList.tag_url = `${c.domain}:${c.port}/${c.icon_dir}/${articleList.tag_name}`;
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

    c.body = {
        code: 0,
        data,
        msg: 'Successfully get the article list!'
    }
});
// 根据id获取文章内容
router.get('/article/getArticleCnt', async c => {
    const ip = c.req.connection.remoteAddress;
    const { aid } = c.query;
    if (!aid) {
        c.body = {
            code: 1,
            msg: '请传递文章id!'
        }
        return;
    }
    // 更新文章阅读数量
    const read_count = await article.getArticleReadCount(aid);
    await article.setArticleReadCount(aid, ++read_count[0].read_count);
    const articleInfo = await article.getArticleCnt(aid, ip);
    if (articleInfo.length) {
        const articleContent = articleInfo[0];
        articleContent.cover = `${c.domain}:${c.port}/${articleContent.cover}`;
        articleContent.tag_url = `${c.domain}:${c.port}/${c.icon_dir}/${articleContent.tag_name}`;
        c.body = {
            code: 0,
            articleContent,
            msg: 'Successfully get the article content!'
        }
    } else {
        c.body = {
            code: 1,
            msg: 'Failed get the article content!'
        }
    }
});
// 获取所有标签
router.get('/article/getArticleTag', async c => {
    const tagList = await article.getArticleTag();
    c.body = {
        c: 0,
        m: 'Successfully get the tag list',
        tagList
    }
});
// 通过标签获取文章列表
router.get('/article/getArticleListByTag', async c => {
    const ip = c.req.connection.remoteAddress;
    let { tag, page } = c.query;
    // 查询限制条数
    const articleLen = c.articleLen;
    const skip = (page - 1) * articleLen;
    const data = {};

    // 文章列表
    const articleList = await article.getArticleListByTag(ip, tag, skip, articleLen);
    articleList.map(articleList => {
        articleList.cover = `${c.domain}:${c.port}/${articleList.cover}`;
        articleList.tag_url = `${c.domain}:${c.port}/${c.icon_dir}/${articleList.tag_name}`;
    });
    data.articleList = articleList;

    // 文章总数
    let total = await article.getArticleTotalByTag(tag);
    total = total[0].total;
    data.total = total;

    // 每页显示条数
    data.page_size = articleLen;

    c.body = {
        code: 0,
        data,
        msg: 'Successfully get the article list!'
    }
});
// 点赞
router.get('/article/givealike', async c => {
    const ip = c.req.connection.remoteAddress;
    const { aid } = c.query;
    const isLike = await article.isLike(ip, aid);
    if (isLike.length === 0) {
        const likehandle = await article.givealike(ip, aid);
        if (likehandle.affectedRows === 1) {
            c.body = {
                code: 0,
                msg: '点赞成功！'
            };
        } else {
            c.body = {
                code: 500,
                msg: '操作失败！'
            };
        }
    } else {
        const cancelalike = await article.cancelalike(ip, aid);
        if (cancelalike.affectedRows === 1) {
            c.body = {
                code: 1,
                msg: '取消赞！'
            };
        } else {
            c.body = {
                code: 500,
                msg: '操作失败！'
            };
        }
    }
});
module.exports = router;