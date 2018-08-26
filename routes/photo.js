const router = require('koa-router')();

router.get('/photo', async ctx => {
    await ctx.render('photo', {name: 'photo'});
});
router.get('/photo/:blogID', async ctx => {
    const blogID = ctx.params.blogID;
    await ctx.render('photo', {name: blogID});
});

module.exports = router;