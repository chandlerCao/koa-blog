const path = require('path');
const koaBody = require('koa-body');
const dateDir = require('../utils/date-dir');
const randomID = require('../utils/random-id');
const config = require('../config');
module.exports = async app => {
    app.use(koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(config.root_dir, `${config.static_dir}`), // 设置文件上传目录
            keepExtensions: true,    // 保持文件的后缀
            maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
            onFileBegin(name, file) {
                file.path = `${this.uploadDir}/${dateDir()}/${randomID()}`; // 设置文件上传目录
            }
        }
    }));
}