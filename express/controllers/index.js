const fs = require('fs');


/* 
    发送 首页文件
 */
module.exports = {
    'GET /': (req, res) => {
        fs.createReadStream('static/index.html').pipe(res);
    },
    'GET /index': (req, res) => {
        fs.createReadStream('static/index.html').pipe(res);
    }
}