const mongoose = require('mongoose');
const dbURI = require('./keys').mongoURI;


// 链接数据库
function linkDb() {
    mongoose.connect(dbURI, {
            useNewUrlParser: true
        })
        .then(() => {
            console.log('数据库链接成功');
        })
        .catch((err) => {
            console.log(err);
        });
}


module.exports = linkDb;