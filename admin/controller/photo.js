const fs = require('fs');
const router = require('koa-router')();
// 一个实现jwt的包
const jwt = require('jsonwebtoken');
// 工具包
const tools = require('../../tools');
// 获取用户模型
const Usermodel = require('../model/Usermodel');

router.get('/photo', async c => {
    await c.render('photo');
});
// 用户登录
router.post('/login', async c => {
    const {username, password} = c.request.body;
    if( username.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '用户名不能为空！',
        }
        return;
    }else if( password.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '密码不能为空！',
        }
        return;
    }
    // 实例化用户模型
    const usermodel = new Usermodel();
    // 检查是否已经存在
    const checkRes = await usermodel.checkUser(username)
    if( !checkRes || !checkRes.length ) {
        c.body = {
            code: 1,
            msg: '用户名不存在！'
        }
    }
    else {
        // 检查是否已经存在
        const getUserInfo = await usermodel.login(username, password);
        if( !getUserInfo || !getUserInfo.length ) {
            c.body = {
                code: 1,
                msg: '密码错误！'
            }
        }else {
            c.body = {
                code: 0,
                msg: '登录成功！',
                token: 'token'
            }
        }
    }
});
// 用户注册
router.post('/register', async c => {
    // 获取用户名和密码
    const {username, password} = c.request.body;
    if( username.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '用户名不能为空！',
        }
        return;
    }else if( password.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '密码不能为空！',
        }
        return;
    }
    // 实例化用户模型
    const usermodel = new Usermodel();
    // 检查是否已经存在
    const checkRes = await usermodel.checkUser(username)
    if( checkRes && checkRes.length ) {
        c.body = {
            code: 1,
            msg: '用户名已存在！'
        }
    }else {
        // 随机id
        const id = tools.getRandomIdByTime();
        // 注册
        const res = await usermodel.register(id, username, password);
        c.body = {
            code: 0,
            msg: '注册成功！',
            token: 'token'
        }
    }
});
router.get('/upload', async c => {
    await c.render('uploadfile');
});
router.post('/upload', async c => {
    const {base64} = c.request.body;
    const path = 'public/img/'+ tools.getRandomIdByTime() +'.png';
    // 去掉图片base64码前面部分data:image/png;base64
    const newBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
    // 把base64码转成buffer对象，
    const dataBuffer = new Buffer(newBase64, 'base64');
    // 用fs写入文件
    await fs.writeFile(path, dataBuffer);
    c.body = {
        code: 0,
        msg: '上传成功'
    }
});
module.exports = router;