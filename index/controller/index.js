const router = require('koa-router')();
const articleModel = require('../model/articleModel');
// 获取文章模型
const article = new articleModel();
// 获取文章列表
router.post('/article/getArticleList', async c => {
    const ip = c.req.connection.remoteAddress;
    let { page } = c.request.body;
    if (page) page = parseInt(page);
    else page = 1;
    // 查询限制条数
    const articleLen = c.articleLen;
    const skip = (page - 1) * articleLen;
    let articleList = await article.getArticleList(ip, skip, articleLen);
    articleList.map(articleList => {
        articleList.cover = `${c.domain}:${c.port}/${articleList.cover}`;
        articleList.tag_url = `${c.domain}:${c.port}/${c.icon_dir}/${articleList.tag_name}`;
    });
    c.body = {
        code: 0,
        articleList,
        msg: 'Successfully get the article list!'
    }
});
// 根据id获取文章内容
router.post('/article/getArticleCnt', async c => {
    const { aid } = c.request.body;
    if (!aid) {
        c.body = {
            code: 1,
            msg: '请传递文章id!'
        }
        return;
    }
    // 更新文章阅读数量
    await article.setArticleReadCount(aid);
    const articleInfo = await article.getArticleCnt(aid);
    if (articleInfo.length) {
        const articleContent = articleInfo[0];
        articleContent.cover = `${c.domain}:${c.port}/${articleContent.cover}`;
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
router.post('/article/getArticleTag', async c => {
    const tagList = await article.getArticleTag();
    c.body = {
        c: 0,
        m: 'Successfully get the tag list',
        tagList
    }
});
// 通过标签获取文章列表
router.post('/article/getArticleListByTag', async c => {
    const ip = c.req.connection.remoteAddress;
    let { tid, page } = c.request.body;
    // 查询限制条数
    const articleLen = c.articleLen;
    const skip = (page - 1) * articleLen;
    const articleList = await article.getArticleListByTag(ip, tid, skip, articleLen);
    articleList.map(articleList => {
        articleList.cover = `${c.domain}:${c.port}/${articleList.cover}`;
        articleList.tag_url = `${c.domain}:${c.port}/${c.icon_dir}/${articleList.tag_name}`;
    });
    c.body = {
        code: 0,
        articleList,
        msg: 'Successfully get the article list!'
    }
});
// 点赞
router.post('/article/givealike', async c => {
    const ip = c.req.connection.remoteAddress;
    const { aid } = c.request.body;
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
        console.log(cancelalike);
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
})
module.exports = router;