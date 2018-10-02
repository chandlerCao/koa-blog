const fs = require('fs');
// token 保存时长
const expiresIn = '24h';
// jwt
const jwt = require('jsonwebtoken');
// 生成随机id
function getRandomIdByTime(len=24) {
    if(len < 11) len = 11;
    let id = '';
    for (let i = 0; i < len - 11; i++) {
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
};
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
            await next();
        }
    }
};
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
};
// 创建日期文件夹
async function createDateDir() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 判断有无年文件夹
    return new Promise((resolve, reject) => {
        try {
            fs.statSync(`assets/${year}`);
            resolve();
        } catch (error) {
            reject();
        }
    })
    // 判断有无月文件夹
    .then(() => {
        return new Promise((resolve, reject) => {
            try {
                fs.statSync(`assets/${year}/${month}`);
                resolve();
            } catch (error) {
                reject();
            }
        });
    })
    // 判断有无日文件夹
    .then(() => {
        return new Promise((resolve, reject) => {
            try {
                fs.statSync(`assets/${year}/${month}/${day}`);
                resolve(`assets/${year}/${month}/${day}`);
            } catch (error) {
                reject();
            }
        });
    })
    // 没有日文件夹，创建日文件夹
    .catch(() => {
        fs.mkdirSync(`assets/${year}/${month}/${day}`);
        return new Promise(resolve => {
            resolve(`assets/${year}/${month}/${day}`);
        });
    })
    // 没有月文件夹，创建月和日文件夹
    .catch(() => {
        fs.mkdirSync(`assets/${year}/${month}`);
        fs.mkdirSync(`assets/${year}/${month}/${day}`);
        return new Promise(resolve => {
            resolve(`assets/${year}/${month}/${day}`);
        });
    })
    // 创建年月日文件夹
    .catch(() => {
        fs.mkdirSync(`assets/${year}`);
        fs.mkdirSync(`assets/${year}/${month}`);
        fs.mkdirSync(`assets/${year}/${month}/${day}`);
        return new Promise(resolve => {
            resolve(`assets/${year}/${month}/${day}`);
        });
    })
};
module.exports = {
    getRandomIdByTime,
    createToken,
    verifyToken,
    checkLogin,
    createDateDir
}