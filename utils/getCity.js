const http = require('http');
module.exports = async ip => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: `http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(data);
                resolve(data);
            });
        });

        req.on('error', (e) => {
            resolve('中国');
        });

        req.end();
    });
}