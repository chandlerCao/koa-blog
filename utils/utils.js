// token 保存时长
const expiresIn = '24h';
// jwt
const jwt = require('jsonwebtoken');
// 生成随机id
function getRandomIdByTime() {
    let id = '';
    for (let i = 0; i < 13; i++) {
        id += Math.floor( Math.random() * 16 ).toString(16);
    }
    id += new Date().getTime().toString(16);
    return id;
};
// 生成token
function createToken(userInfo, secret) {
    // 用户信息
    userInfo = userInfo || {};
    // 秘钥
    secret = secret || 'Chandler Cao';
    return jwt.sign(userInfo, secret, {
        expiresIn
    });
}
// 解析token中间件
async function verifyToken(c, next) {
    if ( c.request && c.response ) {
        if( (/admin/i).test(c.request.url) ) {
            try {
                const {token, uid} = c.header;
                if( token === '' ) {
                    c.status = 401;
                    c.body = {
                        code: 1,
                        msg: '登陆失效！'
                    }
                }
                // 解析token
                const userInfo = jwt.verify(token, uid);
                if( userInfo.isAdmin === 1 ) {
                    await next();
                }
                // 如果非管理员
                else {
                    c.status = 401;
                    c.body = {
                        code: 1,
                        msg: '登陆失效！'
                    }
                }
            } catch (err) {
                c.status = 401;
                c.body = {
                    code: 1,
                    msg: '登陆失效！'
                }
            }
        } else if((/user/i).test( c.request.url )) {
            await next();
        } else if( (/index/i).test(c.request.url) ) {
            console.log('前台请求');
            await next();
        }
    }
}
// 检查是否处于登录状态
function checkLogin(token, secret) {
    return new Promise((resolve, reject) => {
        try {
            if( token === '' ) {
                reject('Not logged in');
                return;
            }
            const userInfo = jwt.verify(token, secret);
            if( userInfo.isAdmin === 1 ) resolve(userInfo.username);
            else reject('Not logged in');
        } catch (err) {
            reject('Not logged in');
        }
    });
}
module.exports = {
    getRandomIdByTime,
    createToken,
    verifyToken,
    checkLogin
}