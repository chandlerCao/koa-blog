const fs = require('fs');
const config = require('../config');
const staticDir = config.static_dir;
// 创建日期文件夹
module.exports = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 判断有无年文件夹
    return new Promise((resolve, reject) => {
        try {
            fs.statSync(`${staticDir}/${year}`);
            resolve();
        } catch (error) {
            reject();
        }
    })
        // 判断有无月文件夹
        .then(() => {
            return new Promise((resolve, reject) => {
                try {
                    fs.statSync(`${staticDir}/${year}/${month}`);
                    resolve();
                } catch (error) {
                    reject();
                }
            });
        })
        // 判断有无日文件夹
        .then(() => {
            return new Promise((resolve, reject) => {
                try {
                    fs.statSync(`${staticDir}/${year}/${month}/${day}`);
                    resolve(`${year}/${month}/${day}`);
                } catch (error) {
                    reject();
                }
            });
        })
        // 没有日文件夹，创建日文件夹
        .catch(() => {
            fs.mkdirSync(`${staticDir}/${year}/${month}/${day}`);
            return new Promise(resolve => {
                resolve(`${year}/${month}/${day}`);
            });
        })
        // 没有月文件夹，创建月和日文件夹
        .catch(() => {
            fs.mkdirSync(`${staticDir}/${year}/${month}`);
            fs.mkdirSync(`${staticDir}/${year}/${month}/${day}`);
            return new Promise(resolve => {
                resolve(`${year}/${month}/${day}`);
            });
        })
        // 没有年文件夹，创建年和月和日文件夹
        .catch(() => {
            fs.mkdirSync(`${staticDir}/${year}`);
            fs.mkdirSync(`${staticDir}/${year}/${month}`);
            fs.mkdirSync(`${staticDir}/${year}/${month}/${day}`);
            return new Promise(resolve => {
                resolve(`${year}/${month}/${day}`);
            });
        });
};