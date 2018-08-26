const router = require('koa-router')();

router.get('/', async (ctx) => {
    await ctx.render('index');
});

module.exports = router;