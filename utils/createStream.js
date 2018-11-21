const fs = require('fs');

module.exports = async (read_path, write_path) => {
    return new Promise((res, rej) => {
        const readStream = fs.createReadStream(read_path);
        let data = [];
        readStream.on('end', () => {
            const writeStream = fs.createWriteStream(write_path);
            writeStream.on('finish', () => {
                res();
            });
            data = Buffer.concat(data);
            writeStream.write(data);
            writeStream.end();
        });
        readStream.on('data', chunk => {
            data.push(chunk);
        });
        readStream.on('error', err => {
            console.log('错误！');
            rej(err);
        });
    })
}