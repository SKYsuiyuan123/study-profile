const passport = require('passport');
require('../config/passport')(passport);


/* 
    获取个人信息
    1、验证 token
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
                email: req.user.email
            }
        });
    }]
}