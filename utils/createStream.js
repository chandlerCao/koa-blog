const fs = require('fs');

module.exports = async (read_path, write_path) => {
    return new Promise((res, rej) => {
        const readStream = fs.createReadStream(read_path);
        const writeStream = fs.createWriteStream(write_path);
        readStream.on('end', () => {
            res();
        });
        readStream.on('data', chunk => {
            writeStream.write(chunk);
        });
    })
}