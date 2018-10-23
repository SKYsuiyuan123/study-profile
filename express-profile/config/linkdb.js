const mongoose = require('mongoose');
const dbURI = require('./keys').mongoURI;

function linkdb() {
    // 链接数据库
    mongoose.connect(dbURI, {
            useNewUrlParser: true
        })
        .then(() => {
            console.log('数据库链接成功');
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = linkdb;