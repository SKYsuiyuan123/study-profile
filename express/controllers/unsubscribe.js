const passport = require('passport');
require('../config/passport')(passport);

// 引入用户模型
const User = require('../models/user');


/* 
    注销用户
 */
module.exports = {
    'DELETE /api/unsubscribe': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        User.findOneAndRemove({
                _id: req.user.id
            })
            .then(() => {
                res.jons({
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