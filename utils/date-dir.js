const fs = require('fs');
// 创建日期文件夹
module.exports = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 判断有无年文件夹
    return new Promise((resolve, reject) => {
        try {
            fs.statSync(`assets/${year}`);
            resolve();
        } catch (error) {
            reject();
        }
    })
    // 判断有无月文件夹
    .then(() => {
        return new Promise((resolve, reject) => {
            try {
                fs.statSync(`assets/${year}/${month}`);
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
                fs.statSync(`assets/${year}/${month}/${day}`);
                resolve(`${year}/${month}/${day}`);
            } catch (error) {
                reject();
            }
        });
    })
    // 没有日文件夹，创建日文件夹
    .catch(() => {
        fs.mkdirSync(`assets/${year}/${month}/${day}`);
        return new Promise(resolve => {
            resolve(`${year}/${month}/${day}`);
        });
    })
    // 没有月文件夹，创建月和日文件夹
    .catch(() => {
        fs.mkdirSync(`assets/${year}/${month}`);
        fs.mkdirSync(`assets/${year}/${month}/${day}`);
        return new Promise(resolve => {
            resolve(`${year}/${month}/${day}`);
        });
    })
    // 没有年文件夹，创建年和月和日文件夹
    .catch(() => {
        fs.mkdirSync(`assets/${year}`);
        fs.mkdirSync(`assets/${year}/${month}`);
        fs.mkdirSync(`assets/${year}/${month}/${day}`);
        return new Promise(resolve => {
            resolve(`${year}/${month}/${day}`);
        });
    });
};