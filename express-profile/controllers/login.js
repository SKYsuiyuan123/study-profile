const jwt = require('jsonwebtoken');
const crypto = require('crypto');


// 引入 用户模型
const User = require('../models/user');

// 引入 加密名字
const keys = require('../config/keys');

// 引入验证方法
const validateLoginInput = require('../validation/login');


// 登录
module.exports = {
    'POST /api/login': (req, res) => {
        const {
            errors,
            isValid
        } = validateLoginInput(req.body);

        // 验证 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                errors,
                result: '登录失败。'
            });
        }

        const email = req.body.email;
        const hash = crypto.createHash('md5');
        hash.update(req.body.password);
        const password = hash.digest('hex');

        // 查询数据库
        User.findOne({
                email
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        msg: 'error',
                        email: '当前用户不存在!'
                    });
                } else {
                    // 密码匹配
                    if (password === user.password) {
                        // jwt.sign('规则', '加密名字', '过期时间', '回调函数')
                        const rule = {
                            id: user.id,
                            name: user.name
                        };

                        // 实现 token
                        jwt.sign(rule, keys.secretOrKey, {
                            expiresIn: 36000
                        }, (err, token) => {
                            if (err) {
                                throw err;
                            } else {
                                res.status(200).json({
                                    msg: 'success',
                                    token: 'Bearer ' + token,
                                    errorCode: 0
                                });
                            }
                        });
                    } else {
                        return res.status(400).json({
                            msg: 'error',
                            result: '登录失败，密码错误。'
                        });
                    }
                }
            })
    }
}