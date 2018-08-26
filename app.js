const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const koaNunjucks = require('koa-nunjucks-2');

const app = new Koa();

// 模板引擎
app.use(koaNunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}));
// 静态资源
app.use(static(path.join(__dirname, 'public')));

// 主页
app.use(require('./routes').routes());
// 相册
app.use(require('./routes/photo').routes());

app.listen(8001, () => {
    console.log('localhost:8001');
});