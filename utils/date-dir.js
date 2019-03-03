const fs = require('fs');
const config = require('../config');
const staticDir = config.static_dir;
// 创建日期文件夹
module.exports = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    try {
        fs.statSync(`${staticDir}/${year}`);
    } catch (error) {
        fs.mkdirSync(`${staticDir}/${year}`);
        fs.mkdirSync(`${staticDir}/${year}/${month}`);
        fs.mkdirSync(`${staticDir}/${year}/${month}/${day}`);
        return `${year}/${month}/${day}`;
    }
    try {
        fs.statSync(`${staticDir}/${year}/${month}`);
    } catch (error) {
        fs.mkdirSync(`${staticDir}/${year}/${month}`);
        fs.mkdirSync(`${staticDir}/${year}/${month}/${day}`);
        return `${year}/${month}/${day}`;
    }
    try {
        fs.statSync(`${staticDir}/${year}/${month}/${day}`);
    } catch (error) {
        fs.mkdirSync(`${staticDir}/${year}/${month}/${day}`);
        return `${year}/${month}/${day}`;
    }
    return `${year}/${month}/${day}`;
};