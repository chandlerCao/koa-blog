const request = require('request');
module.exports = async ip => {
    return new Promise((resolve, reject) => {
        resolve('中国');
        request({
            url: `http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`,
            method: `GET`,
        }, function (error, response, body) {
            if (error) {
                resolve('中国');
                return;
            }
            body = JSON.parse(body);
            resolve(body.data.city);
        });
    });
}