// 一个实现jwt的包
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
const secret = 'chandlerhouston';
function createToken(id, username) {
    return jwt.sign({
        id,
        username,
    }, secret, {
        expiresIn: '1h'
    })
}
// 生成token
function verifyToken(token) {
    const tokenCnt = jwt.verify(token, secret);
    return tokenCnt;
}
module.exports = {
    getRandomIdByTime,
    createToken,
    verifyToken
}