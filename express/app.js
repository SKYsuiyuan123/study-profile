const express = require('express');

// 引入路由
const routerControllers = require('./controller');


// 实例化
const app = express();

// 链接数据库
const linkDb = require('./config/linkdb')();

// 路由
app.use(routerControllers());

// 静态文件代理
app.use(express.static('static'));

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});