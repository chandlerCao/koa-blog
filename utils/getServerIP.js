module.exports = () => {
    const networkInterfaces = require('os').networkInterfaces();
    let ip = '';
    for (const netWork in networkInterfaces) {
        const netObj = networkInterfaces[netWork];
        netObj.forEach(netItem => {
            if (netItem.family === 'IPv4' && netItem.address !== '127.0.0.1') ip = netItem.address;
        });
    }
    return ip;
}