const gravatar = require('gravatar');
const crypto = require('crypto');

// 引入用户 模型
const User = require('../models/user');

// 引入验证方法
const validateRegisterInput = require('../validation/register');


// 注册
module.exports = {
    'POST /api/register': (req, res) => {
        const {
            errors,
            isValid
        } = validateRegisterInput(req.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                errors,
                result: '注册失败。'
            });
        }

        // 查询数据库中是否有该邮箱
        User.findOne({
                email: req.body.email
            })
            .then((user) => {
                if (user) {
                    return res.status(400).json({
                        msg: 'error',
                        email: '该邮箱已被注册',
                        result: '注册失败。'
                    });
                } else {
                    let avatar = gravatar.url(req.body.email, {
                        s: '200',
                        r: 'pg',
                        d: 'mm'
                    });

                    const hash = crypto.createHash('md5');
                    hash.update(req.body.password);
                    const password = hash.digest('hex');

                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        avatar,
                        password
                    });

                    newUser.save()
                        .then((user) => {
                            res.json({
                                msg: 'success',
                                result: '注册成功',
                                errorCode: 0
                            })
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
    }
}