const router = require('koa-router')();
// 一个实现jwt的包
const jwt = require('jsonwebtoken');

router.get('/photo', async ctx => {
    ctx.session.name = ctx.query.name;
    await ctx.render('photo');
});

// 动态路径参数
router.get('/photo/:blogID', async ctx => {
    // const blogID = ctx.params.blogID;
    await ctx.render('photo', {name: ctx.session.name});
});

router.post('/login', async ctx => {
    let userToken = {
        id: ctx.request.body.id,
        name: ctx.request.body.username
    }
    // 生成token
    const token = jwt.sign(userToken, 'learn jwt demo', {expiresIn: '1h'})  //token签名 有效期为1小时
    ctx.body = {
        msg: '登录成功！',
        code: 1,
        token
    }
});

router.post('/getUseInfo', async ctx => {
    const token = ctx.header.authorization;  // 获取jwt
    if (token === '') { // 判断请求头有没有携带 token ,没有直接返回 401
        ctx.throw(401, 'no token detected in http header "Authorization"');
    }
    try {
        // token加密串
        // 解密加密串
        const tokenCnt = await jwt.verify(token, 'learn jwt demo');
        ctx.body = tokenCnt;
    } catch (err) {
        ctx.body = {
            status: 401,
            msg: '请登录'
        };
    }
});

module.exports = router;