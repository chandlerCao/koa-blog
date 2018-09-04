const router = require('koa-router')();

router.get('/', async (ctx) => {
    
    await ctx.render('index', {
        title: 'chandler个人博客，前端工程师个人博客'
    });
});

module.exports = router;