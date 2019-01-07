const router = require('koa-router')();
const commentModel = new (require('../model/commentModel'));
const articleModel = new (require('../model/articleModel'));
const randomID = require('../../utils/random-id');

// 前台配置文件
const indexConfig = require('../index.config');

// 获取评论列表
router.get('/getCommentList', async (ctx, next) => {
    let { aid, page } = ctx.query;
    page = (page < 0 || isNaN(page)) ? 0 : page;
    // 获取评论列表
    const commentList = await commentModel.getCommentList(aid, page * indexConfig.commentLen, indexConfig.commentLen);
    ctx.body = {
        c: 0,
        d: commentList
    }
    await next();
});
// 添加评论
router.post('/addComment', async (ctx, next) => {
    const { comment_text, comment_user, aid } = ctx.request.body;
    if (!comment_text || comment_text.trim() === '') {
        ctx.body = {
            c: 1,
            m: '你的评论内容呢？'
        }
        return;
    }
    if (!comment_user || comment_user.trim() === '') {
        ctx.body = {
            c: 1,
            m: '你没名字？'
        }
        return;
    }
    // 验证aid（文章id)是否存在
    const isArticle = await articleModel.articleExist(aid);
    if (isArticle[0].articleExist === 0) {
        ctx.body = {
            c: 1,
            m: '文章不存在！'
        }
        return;
    }
    // 随机生成评论id
    const comment_id = randomID();
    const addCommentRes = await commentModel.addComment(comment_id, comment_text, comment_user, aid, '47.205.54.33', 'ChongQing');
    if (addCommentRes.affectedRows > 0) {
        // 获取评论内容
        const commentInfo = await commentModel.getCommentCnt(comment_id);
        ctx.body = {
            c: 0,
            d: commentInfo,
            m: '评论成功！'
        };
    } else {
        ctx.body = {
            c: 1,
            m: '评论失败！'
        };
    }
    await next();
});

module.exports = router;