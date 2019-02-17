const router = require('koa-router')();
const articleModel = new (require('../model/articleModel'));
const commentModel = new (require('../model/commentModel'));
const randomID = require('../../utils/random-id');
// 前台配置文件
const indexConfig = require('../index.config');

// 获取（评论）或（回复）列表
async function getList(obj = {}) {
    const { type, args } = obj;
    const list = await commentModel[`get${type}List`](...(Object.values(args)));
    // 如果查询出来评论数量等于当前的值，证明没有查询完成
    let isMore = 1;
    if (list.length === args.limit) {
        // 删除最后一条数据
        list.pop();
    } else isMore = 0;
    // 获取回复列表
    return {
        [`${type}List`]: list,
        isMore
    }
}
// 评论列表
router.get('/getCommentList', async (ctx, next) => {
    let { aid, page } = ctx.query;
    const { ip } = ctx.state;
    page = (page < 0 || isNaN(page)) ? 0 : page;
    // 获取评论列表
    const commentData = await getList({
        type: 'Comment',
        args: { id: aid, ip, skip: page * indexConfig.CommentLimit, limit: indexConfig.CommentLimit + 1 }
    });
    const { CommentList } = commentData;
    for (const commentItem of CommentList) {
        commentItem.replyData = await getList({
            type: 'Reply',
            args: { id: commentItem.cid, ip, skip: 0, limit: indexConfig.ReplyLimit + 1 }
        });
    }
    ctx.body = {
        c: 0,
        d: commentData
    }
    await next();
});
// 回复列表
router.get('/getReplyList', async (ctx, next) => {
    let { cid, page } = ctx.query;
    const { ip } = ctx.state;
    page = (page < 0 || isNaN(page)) ? 0 : page;
    // 获取回复列表
    console.log(page);
    const replyData = await getList({
        type: 'Reply',
        args: { id: cid, ip, skip: page * indexConfig.ReplyLimit, limit: indexConfig.ReplyLimit + 1 }
    });
    ctx.body = {
        c: 0,
        d: replyData
    }
    await next();
})
// 添加评论（回复）
router.post('/addComment', async (ctx, next) => {
    let { cid, toUser, content, user, aid } = ctx.request.body;
    if (!content || content.trim() === '') {
        ctx.body = {
            c: 1,
            m: '你的评论内容呢？'
        }
        return;
    }
    if (content.length > 500) {
        ctx.body = {
            c: 1,
            m: '评论内容过长！'
        }
        return;
    }
    if (!user || user.trim() === '') {
        ctx.body = {
            c: 1,
            m: '你没名字？'
        }
        return;
    }
    if (user.length > 16) {
        ctx.body = {
            c: 1,
            m: '用户名过长！'
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
        return false;
    }
    // 随机生成id
    const id = randomID();
    // 获取客户端ip和城市
    const { ip } = ctx.state;
    const city = await ctx.state.getCity(ip);
    // 如果为回复
    if (cid) {
        // 验证cid（评论）是否存在
        const commentExist = await commentModel.getCommentCnt(cid);
        if (!commentExist.length) {
            ctx.body = {
                c: 1,
                m: '评论不存在！'
            }
            return false;
        }
        // 添加回复
        const addReplyRes = await commentModel.addReply(id, cid, content, user, toUser, aid, ip, city);
        if (addReplyRes.affectedRows > 0) {
            const replyInfo = await commentModel.getReplyCnt(id);
            // 获取评论内容
            ctx.body = {
                c: 0,
                d: replyInfo,
                m: '回复成功！'
            };
        } else {
            ctx.body = {
                c: 1,
                m: '回复失败！'
            };
        }
    } else {
        // 添加评论
        const addCommentRes = await commentModel.addComment(id, content, user, aid, ip, city);
        if (addCommentRes.affectedRows > 0) {
            const commentInfo = await commentModel.getCommentCnt(id);
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
    }
    await next();
});
// 评论点赞
router.post('/commentLike', async ctx => {
    const { ip } = ctx.state;
    const city = '';
    let { cid, rid } = ctx.request.body;
    if (!cid) {
        ctx.body = {
            code: 1,
            m: '评论id未知！'
        };
        return false;
    }
    // 回复点赞
    let [type, id] = ['Comment', cid];
    if (rid) {
        type = 'Reply';
        id = rid;
    }
    // 查询评论是否存在
    const commentExist = await commentModel[`get${type}Cnt`](id);
    // 如果评论存在
    if (!commentExist[0].aid) {
        ctx.body = {
            c: 1,
            m: '当前评论不存在！'
        }
        return;
    }
    // 点赞状态
    let likeState;
    // 已经点赞，取消
    const cancelLike = await commentModel[`cancel${type}Like`](id, ip);
    // 如果取消成功，表示已经点赞了
    if (cancelLike.affectedRows) {
        likeState = 0;
    } else {
        await commentModel[`givea${type}like`](id, ip, city);
        likeState = 1;
    }
    // 获取总赞个数
    const likeTotalRes = await commentModel[`${type}LikeCount`](id);
    const likeTotal = likeTotalRes.length > 0 ? likeTotalRes[0].likeTotal : 0;
    ctx.body = {
        c: 0,
        m: '点赞成功！',
        d: {
            likeState,
            likeTotal: likeTotal
        }
    }

});
// 评论点赞
module.exports = router;