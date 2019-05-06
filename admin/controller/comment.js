const Router = require('koa-router');
const CommentModel = require('../model/CommentModel');
const commentController = new Router();
const adminConfig = require('../admin.config');
// 创建文章模型
const commentModel = new CommentModel();

// 评论列表
commentController.get('/comment/getCommentList', async (ctx, next) => {
    let { page } = ctx.query;
    page = Number(page);
    page = (page < 1 || isNaN(page)) ? 1 : page;
    // 评论列表
    const commentList = await commentModel.getCommentList((page - 1) * adminConfig.CommentLimit, adminConfig.CommentLimit);
    ctx.body = {
        c: 0,
        d: {
            commentList,
            pageSize: adminConfig.CommentLimit
        }
    }
    await next();
});
// 评论总数
commentController.get('/comment/getCommentCount', async (ctx, next) => {
    const commentCountRes = await commentModel.getCommentCount();
    ctx.body = {
        c: 0,
        d: { total: commentCountRes[0].commentCount }
    }
    await next();
});
// 删除评论
commentController.post('/comment/commentDel', async (ctx, next) => {
    let { cids } = ctx.request.body;
    cids = Object.prototype.toString.call(cids) === '[object Array]' ? cids : [];
    if(!cids.length) {
        ctx.body = { c: 1, m: '请传递正确的评论id！' };
        return false;
    }
    const delCommentRes = await commentModel.commentDel(cids);
    if (delCommentRes.affectedRows) ctx.body = { c: 0, m: '删除成功！' };
    else ctx.body = { c: 1, m: '删除失败！' };
    await next();
});

// 回复列表
commentController.get('/comment/getReplyList', async (ctx, next) => {
    let { cid, page } = ctx.query;
    page = (page < 1 || isNaN(page)) ? 1 : page;
    // 获取回复列表
    const replyList = await commentModel.getReplyList(cid, (page - 1) * adminConfig.CommentLimit, adminConfig.CommentLimit);
    ctx.body = {
        c: 0,
        d: {
            replyList,
            pageSize: adminConfig.CommentLimit
        }
    }
    await next();
});
// 回复总数
commentController.get('/comment/getReplyCount', async (ctx, next) => {
    let { cid } = ctx.query;
    const replyCountRes = await commentModel.getReplyCount(cid);
    ctx.body = {
        c: 0,
        d: { total: replyCountRes[0].replyCount }
    }
    await next();
});
module.exports = commentController;