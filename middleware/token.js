const jwt = require('jsonwebtoken');
const token_config = require('../config/token.config');
module.exports = {
    generateToken: (userInfo = {}) => {
        return jwt.sign(userInfo, token_config.secret, {
            expiresIn: '10h'
        });
    },
    decodeToken: async (c, next) => {
        if (c.path.includes('admin/user/login') || c.path.includes('index')) {
            await next();
        } else {
            const { token } = c.header;
            if (token === '') {
                c.body = {
                    code: 1,
                    msg: '登陆失效！'
                }
            }
            let userInfo = null;
            try {
                // 解析token
                userInfo = jwt.verify(token, token_config.secret);
            } catch (err) {
                c.body = {
                    code: 1,
                    msg: '登陆失效！'
                }
                return;
            }
            if (userInfo.isAdmin === 1) await next();
            // 如果非管理员
            else {
                c.body = {
                    code: 1,
                    msg: '登录失效！'
                }
            }
        }
    }
}