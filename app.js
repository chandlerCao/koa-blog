const Koa = require('koa');
const app = new Koa();
/* 静态资源 */
require('./main/static')(app);
/* 跨域 */
require('./main/cors')(app);
/* 挂载自定义属性 */
require('./main/custom')(app);
/* koa-body */
require('./main/koaBody')(app);
/* 获取ip和城市 */
require('./main/address')(app);
/* 路由 */
require('./main/router')(app);
/* xss */
require('./main/xss')(app);
/* 监听8080端口 */
require('./main/port')(app);
