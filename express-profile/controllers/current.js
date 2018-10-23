const passport = require('passport');
require('../config/passport')(passport);

// 发送个人信息
/*
    先验证 token
 */
module.exports = {
    'GET /api/current': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        res.json({
            msg: 'success',
            result: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
            },
            errorCode: 0
        });
    }]
}