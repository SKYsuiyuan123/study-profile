const passport = require('passport');
require('../config/passport')(passport);

// 引入 用户模型
const User = require('../models/user');


module.exports = {
    // 注销用户  Private
    'DELETE /api/unsubscribe': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        User.findOneAndRemove({
                _id: req.user.id
            })
            .then(() => {
                res.json({
                    msg: 'success',
                    result: '注销成功'
                });
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '注销失败'
                });
                console.log(err);
            });
    }]
}