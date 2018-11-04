const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


// 要先 初始化一下 数据模型，不然 下边的 passport 初始化 就会报错
const users = require('./models/user');


// add url-router in /constrollers
function addMapping(router, mapping) {
    for (const url in mapping) {

        if (url.startsWith('GET ')) {

            let path = url.substring(4);
            router.get(path, mapping[url]);

        } else if (url.startsWith('POST ')) {

            let path = url.substring(5);
            router.post(path, mapping[url]);

        } else if (url.startsWith('DELETE ')) {

            let path = url.substring(7);
            router.delete(path, mapping[url]);

        } else if (url.startsWith('PUT ')) {

            let path = url.substring(4);
            router.put(path, mapping[url]);

        } else {
            // 无效的 url
            console.log(`invalid URL: ${url}`);
        }
    }
}


function addControllers(router, dir) {
    // 这里可以用 sync 是因为 只在启动时运行一次，不存在性能问题
    let js_files = fs.readdirSync(__dirname + '/controllers').filter((f) => {
        return f.endsWith('.js');
    });

    for (const f of js_files) {
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    }
}


// 如果不传参数，扫描目录默认为 'controllers'
function initRouter(dir = 'controllers') {

    // 实例化 router
    let router = express.Router();

    // 解析 post 请求
    router.use(bodyParser.urlencoded({
        extended: true
    }));

    // 解析 post application/json 格式
    router.use(bodyParser.json());

    // passport 初始化
    router.use(passport.initialize());

    // 设置跨域访问
    router.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

        if (req.method == 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    });

    addControllers(router, dir);

    return router;
}


module.exports = initRouter;