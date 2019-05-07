const jwt = require('jsonwebtoken');
const adminConfig = require('../admin/admin.config');
module.exports = {
    generateToken: (userInfo = {}) => {
        return jwt.sign(userInfo, adminConfig.token.secret, {
            expiresIn: adminConfig.token.expiresIn //  token保存时长
        });
    },
    decodeToken: async (ctx, next) => {
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
            userInfo = jwt.verify(token, adminConfig.token.secret);
        } catch (err) {
            ctx.throw(401);
            ctx.body = {
                c: 1,
                m: '登陆失效！'
            }
            return;
        }
        if (userInfo.isAdmin) {
            ctx.state.username = userInfo.username;
            await next();
        } else {
            // 如果非管理员
            ctx.throw(401);
            ctx.body = {
                c: 1,
                m: '非管理员禁止登录！'
            }
        }
    }
}