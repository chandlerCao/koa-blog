const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports = {
    generateToken: (userInfo = {}) => {
        return jwt.sign(userInfo, config.token.secret, {
            expiresIn: config.token.expiresIn
        });
    },
    decodeToken: async (ctx, next) => {
        if (ctx.path.includes('admin/user/login') || ctx.path.includes('index') || ctx.path === '/') {
            await next();
        } else {
            const { token } = ctx.header;
            if (token === '') {
                ctx.body = {
                    code: 1,
                    msg: '登陆失效！'
                }
            }
            let userInfo = null;
            try {
                // 解析token
                userInfo = jwt.verify(token, config.token.secret);
            } catch (err) {
                ctx.body = {
                    code: 1,
                    msg: '登陆失效！',
                    errMsg: err
                }
                return;
            }
            if (userInfo.isAdmin === 1) await next();
            // 如果非管理员
            else {
                ctx.body = {
                    code: 1,
                    msg: '登录失效！'
                }
            }
        }
    }
}