const router = require('koa-router')();
const articleModel = new (require('../model/articleModel'));
const commentModel = new (require('../model/commentModel'));
const randomID = require('../../utils/random-id');
// 前台配置文件
const indexConfig = require('../index.config');

/* router */
// 获取评论列表
router.get('/getCommentList', async (ctx, next) => {
    let { aid, page } = ctx.query;
    const { ip } = ctx.state;
    page = (page < 0 || isNaN(page)) ? 0 : page;
    // 获取评论列表
    const commentList = await commentModel.getCommentList(aid, ip, page * indexConfig.commentLen, indexConfig.commentLen);
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
    const cid = randomID();
    // 获取客户端ip和城市
    const { ip, city } = ctx.state;
    // 添加评论
    const addCommentRes = await commentModel.addComment(cid, comment_text, comment_user, aid, ip, city);
    if (addCommentRes.affectedRows > 0) {
        const commentInfo = await commentModel.getCommentCnt(cid, ip);
        // 获取评论内容
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
// 评论点赞
router.post('/commentLike', async (ctx, next) => {
    const { ip, city } = ctx.state;
    const { cid } = ctx.request.body;
    if (!cid) {
        ctx.body = {
            code: 1,
            m: '评论id未知！'
        };
        return false;
    }
    // 查询评论是否存在
    const commentExist = await commentModel.getCommentCnt(cid);
    // 如果评论存在
    if (commentExist[0].cid) {
        // 点赞状态
        let likeState;
        // 已经点赞，取消
        const cancelLike = await commentModel.cancelLike(cid, ip);
        // 如果删除成功，表示已经点赞了
        if (cancelLike.affectedRows) {
            likeState = 0;
        } else {
            await commentModel.givealike(cid, ip, city);
            likeState = 1;
        }
        // 获取总赞个数
        const likeTotalRes = await commentModel.likeCount(cid);
        const likeTotal = likeTotalRes.length > 0 ? likeTotalRes[0].likeTotal : 0;
        ctx.body = {
            c: 0,
            m: '点赞成功！',
            d: {
                likeState,
                likeTotal: likeTotal
            }
        }
    } else {
        ctx.body = {
            c: 1,
            m: '评论不存在！'
        }
    }
    await next();
});

module.exports = router;