const path = require('path');
const nodeSchedule = require('node-schedule')
const koaBody = require('koa-body');
const dateDir = require('../utils/date-dir');
const randomID = require('../utils/random-id');
const config = require('../config');
module.exports = app => {
    // 每天凌晨创建当日文件夹
    let comDateDir = '2019/2/7';
    nodeSchedule.scheduleJob('0 0 0 * * *', async () => {
        comDateDir = await dateDir();
    });
    app.use(koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(config.root_dir, `${config.static_dir}/${comDateDir}`), // 设置文件上传目录
            keepExtensions: true,    // 保持文件的后缀
            maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
            onFileBegin(name, file) {
                file.path = `${this.uploadDir}/${randomID()}`; // 设置文件上传目录
            }
        }
    }));
}