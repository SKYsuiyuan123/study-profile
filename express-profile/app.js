const express = require('express');

const routerControllers = require('./controller');

const app = express();

// 链接数据库
const linkdb = require('./config/linkdb')();

// 路由
app.use(routerControllers());

// 静态文件代理
app.use(express.static('static'));


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});