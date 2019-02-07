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
            if (!token) {
                ctx.throw(401);
                ctx.body = {
                    c: 1,
                    m: '登陆失效！'
                }
                return false;
            }
            let userInfo = null;
            try {
                // 解析token
                userInfo = jwt.verify(token, config.token.secret);
            } catch (err) {
                ctx.throw(401);
                ctx.body = {
                    c: 1,
                    m: '登陆失效！'
                }
                return;
            }
            if (userInfo.isAdmin === 1) await next();
            // 如果非管理员
            else {
                ctx.throw(401);
                ctx.body = {
                    c: 1,
                    m: '非管理员！'
                }
            }
        }
    }
}