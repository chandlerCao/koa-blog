// 获取客户端ip
module.exports = req => {
    let ip = req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || '';
    return ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
};