/*
 * @Author: Sky
 * @Email: 13011316073@163.com
 * @Date: 2018-11-17 19:59:47
 * @LastEditors: Sky
 * @LastEditTime: 2018-11-19 22:38:15
 * @Description: 发送首页的文件
 */
const fs = require('fs');


function sendIndexFile(ctx) {
    ctx.response.type = 'html';
    // 这里的路径相对于 app.js 的路径去定位的
    ctx.response.body = fs.createReadStream('./static/index.html');
}


module.exports = {
    'GET /': async(ctx, next) => {
        sendIndexFile(ctx);
    },
    'GET /index': async(ctx, next) => {
        sendIndexFile(ctx);
    }
}