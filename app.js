const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const app = new Koa();
// 配置
const config = require('./config');
/* 静态资源 */
require('./main/static')(app);
/* 跨域 */
require('./main/cors')(app);
/* 挂载自定义属性 */
require('./main/custom')(app);
/* koa-body */
require('./main/koaBody')(app);
/* 路由 */
require('./main/router')(app);
/* token */
require('./main/token')(app);
/* 获取ip和城市 */
require('./main/address')(app);
/* xss */
require('./main/xss')(app);
/***** 监听8080端口 *****/
app.listen(config.address.port, '0.0.0.0', () => {
    console.log(`the server running at http://${config.address.domain}:${config.address.port}`);
});