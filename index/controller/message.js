const router = require('koa-router')();
const messageModel = new (require('../model/messageModel'));
const randomID = require('../../utils/random-id');
const getList = require('./getList');
// 前台配置文件
const config = require('../index.config');
// 留言列表
router.get('/getMessageList', async (ctx, next) => {
    let { page } = ctx.query;
    const { ip } = ctx.state;
    page = (page < 0 || isNaN(page)) ? 0 : page;
    // 获取评论列表
    const messageData = await getList({
        getListFn: messageModel.getMessageList,
        args: { ip, skip: page * config.messageLimit, limit: config.messageLimit + 1 } // 33333
    });
    const { list } = messageData;
    for (const item of list) {
        item.replyData = await getList({
            getListFn: messageModel.getMReplyList,
            args: { id: item.mid, ip, skip: 0, limit: config.mReplyLimit + 1 }
        });
    }
    ctx.body = {
        c: 0,
        d: messageData
    }
    await next();
});
// 回复列表
router.get('/getMReplyList', async (ctx, next) => {
    let { mid, page } = ctx.query;
    const { ip } = ctx.state;
    page = (page < 0 || isNaN(page)) ? 0 : page;
    // 获取回复列表
    const replyData = await getList({
        getListFn: messageModel.getMReplyList,
        args: { id: mid, ip, skip: page * config.mReplyLimit, limit: config.mReplyLimit + 1 }
    });
    ctx.body = {
        c: 0,
        d: replyData
    }
    await next();
})
// 添加留言（回复）
router.post('/addMessage', async (ctx, next) => {
    let { mid, toUser, content, user } = ctx.request.body;
    if (!content || content.trim() === '') {
        ctx.body = {
            c: 1,
            m: '你的留言内容呢？'
        }
        return;
    }
    if (content.length > 500) {
        ctx.body = {
            c: 1,
            m: '留言内容过长！'
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
    // 随机生成id
    const id = randomID();
    // 获取客户端ip和城市
    const { ip } = ctx.state;
    const city = await ctx.state.getCity(ip);
    // 如果为回复
    if (mid) {
        // 验证留言是否存在
        const messageExist = await messageModel.getMessageCnt(mid);
        if (!messageExist.length) {
            ctx.body = {
                c: 1,
                m: '评论不存在！'
            }
            return false;
        }
        // 添加回复
        const addReplyRes = await messageModel.addReply(id, mid, content, user, toUser, ip, city);
        if (addReplyRes.affectedRows > 0) {
            const replyList = await messageModel.getReplyCnt(id);
            const replyInfo = {
                list: replyList,
                type: 'reply'
            }
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
        const addMessageRes = await messageModel.addMessage(id, content, user, ip, city);
        if (addMessageRes.affectedRows > 0) {
            const messageList = await messageModel.getMessageCnt(id);
            const commentInfo = {
                list: messageList,
                type: 'comment'
            }
            // 获取评论内容
            ctx.body = {
                c: 0,
                d: commentInfo,
                m: '留言成功！'
            };
        } else {
            ctx.body = {
                c: 1,
                m: '留言失败！'
            };
        }
    }
    await next();
});
// 留言点赞
router.post('/messageLike', async ctx => {
    const { ip } = ctx.state;
    const city = await ctx.state.getCity(ip);
    let { mid, rid } = ctx.request.body;
    if (!mid) {
        ctx.body = {
            code: 1,
            m: '评论id未知！'
        };
        return false;
    }
    // 回复点赞
    let [type, id] = ['Message', mid];
    if (rid) {
        type = 'Reply';
        id = rid;
    }
    // 查询留言是否存在
    const commentExist = await messageModel[`get${type}Cnt`](id);
    if (commentExist.length === 0) {
        ctx.body = {
            c: 1,
            m: '当前评论不存在！'
        }
        return;
    }
    // 点赞状态
    let likeState;
    // 已经点赞，取消
    const cancelLike = await messageModel[`cancel${type}Like`](id, ip);
    // 如果取消成功，表示已经点赞了
    if (cancelLike.affectedRows) {
        likeState = 0;
    } else {
        await messageModel[`givea${type}like`](id, ip, city);
        likeState = 1;
    }
    // 获取总赞个数
    const likeTotalRes = await messageModel[`${type}LikeCount`](id);
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
module.exports = router;