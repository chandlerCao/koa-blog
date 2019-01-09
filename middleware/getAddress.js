const requestIp = require('request-ip');
const getCity = require('../utils/getCity');

module.exports = async (ctx, next) => {
    ctx.ip = requestIp.getClientIp(ctx.req);
    ctx.city = await getCity(ctx.ip);
    await next();
}