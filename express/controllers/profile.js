const passport = require('passport');
require('../config/passport')(passport);

// 引入 信息模型
const Profile = require('../models/profiles');
// 引入 用户模型
const User = require('../models/user');

// 引入验证方法
const validateProfileInput = require('../validation/profile');
const validateExperienceInput = require('../validation/exprience');
const validateEducationInput = require('../validation/education');


module.exports = {
    /* 
        创建个人信息
        1, 验证 token
     */
    'POST /api/profile': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const {
            errors,
            isValid
        } = validateProfileInput(req.body);

        // 判断 isValid 是否通过验证
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                result: {
                    errors
                }
            });
        }

        const profileFields = {};
        profileFields.user = req.user.id;

        if (req.body.handle) {
            profileFields.handle = req.body.handle;
        }

        if (req.body.company) {
            profileFields.company = req.body.company;
        }

        if (req.body.website) {
            profileFields.website = req.body.website;
        }

        if (req.body.location) {
            profileFields.location = req.body.location;
        }

        if (req.body.status) {
            profileFields.status = req.body.status;
        }

        // skills
        if (req.body.skills) {
            profileFields.skills = req.body.skills.split(',');
        }

        if (req.body.bio) {
            profileFields.bio = req.body.bio;
        }

        if (req.body.githubUserName) {
            profileFields.githubUserName = req.body.githubUserName;
        }

        profileFields.social = {};

        if (req.body.wechat) {
            profileFields.social.wechat = req.body.wechat;
        }

        if (req.body.QQ) {
            profileFields.social.QQ = req.body.QQ;
        }

        if (req.body.tengxunkt) {
            profileFields.social.tengxunkt = req.body.tengxunkt;
        }

        if (req.body.wangyikt) {
            profileFields.social.wangyikt = req.body.wangyikt;
        }

        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                if (!pro) {
                    Profile.findOne({
                            handle: profileFields.handle
                        })
                        .then((profile) => {
                            if (profile) {
                                errors.handle = '该用户的 handle 个人信息已存在，无法重新创建';
                                res.status(400).json({
                                    msg: 'error',
                                    result: {
                                        errors
                                    }
                                });
                            } else {
                                new Profile(profileFields).save()
                                    .then((pro) => {
                                        res.json({
                                            msg: 'success',
                                            result: {
                                                pro
                                            }
                                        });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '个人信息已存在，无法重新创建!'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }],


    /* 
        编辑个人信息
        1, 验证 token
     */
    'PUT /api/profile': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const profileFields = {};
        profileFields.user = req.user.id;

        if (req.body.handle) {
            profileFields.handle = req.body.handle;
        }

        if (req.body.company) {
            profileFields.company = req.body.company;
        }

        if (req.body.website) {
            profileFields.website = req.body.website;
        }

        if (req.body.location) {
            profileFields.location = req.body.location;
        }

        if (req.body.status) {
            profileFields.status = req.body.status;
        }

        // skills
        if (req.body.skills) {
            profileFields.skills = req.body.skills.split(',');
        }

        if (req.body.bio) {
            profileFields.bio = req.body.bio;
        }

        if (req.body.githubUserName) {
            profileFields.githubUserName = req.body.githubUserName;
        }

        profileFields.social = {};

        if (req.body.wechat) {
            profileFields.social.wechat = req.body.wechat;
        }

        if (req.body.QQ) {
            profileFields.social.QQ = req.body.QQ;
        }

        if (req.body.tengxunkt) {
            profileFields.social.tengxunkt = req.body.tengxunkt;
        }

        if (req.body.wangyikt) {
            profileFields.social.wangyikt = req.body.wangyikt;
        }

        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                if (pro) {
                    Profile.findOneAndUpdate({
                            user: req.user.id
                        }, {
                            $set: profileFields
                        }, {
                            new: true
                        })
                        .then((profile) => {
                            res.json({
                                msg: 'success',
                                result: {
                                    profile
                                }
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '个人信息不存在，请先创建'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }],


    /*
        获取 当前个人信息
        1, 验证 token
     */
    'GET /api/profile': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .populate('user', ['name', 'avatart', 'email'])
            .then((pro) => {
                if (!pro) {
                    // 不存在
                    return res.status(404).json({
                        msg: 'error',
                        result: '用户信息不存在!'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        result: {
                            pro
                        }
                    });
                }
            })
            .catch((err) => {
                res.status(404).json(err);
                console.log(err);
            });
    }],


    /* 
        根据 handle 获取个人信息
            Public
     */
    'GET /api/profile/handle/:handle': [(req, res) => {
        Profile.findOne({
                handle: req.params.handle
            })
            .populate('user', ['name', 'avatart', 'email'])
            .then((pro) => {
                if (!pro) {
                    // 不存在
                    return res.status(404).json({
                        msg: 'error',
                        result: '未找到该用户相关信息!'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        result: {
                            pro
                        }
                    });
                }
            })
            .catch((err) => {
                res.status(404).json(err);
                console.log(err);
            });
    }],


    /* 
        根据 user_id 获取个人信息
        Public
     */
    'GET /api/profile/user/:user_id': [(req, res) => {
        Profile.findOne({
                user: req.params.user_id
            })
            .populate('user', ['name', 'avatart', 'email'])
            .then((pro) => {
                if (!pro) {
                    // 不存在
                    return res.status(404).json({
                        msg: 'error',
                        result: '未找到该用户相关信息!'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        result: {
                            pro
                        }
                    });
                }
            })
            .catch((err) => {
                res.status(404).json(err);
                console.log(err);
            });
    }],


    /* 
        获取 所有人的 个人信息
        Public
     */
    'GET /api/profile/all': [(req, res) => {
        Profile.find()
            .populate('user', ['name', 'avatart', 'email'])
            .then((pros) => {
                if (!pros) {
                    // 不存在
                    return res.status(404).json({
                        msg: 'error',
                        result: '未找到任何用户相关信息!'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        result: {
                            pros
                        }
                    });
                }
            })
            .catch((err) => {
                res.status(404).json(err);
                console.log(err);
            });
    }],


    /* 
        添加个人经历
        1, 验证 token
     */
    'POST /api/profile/exprience': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const {
            errors,
            isValid
        } = validateExperienceInput(req.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                result: {
                    errors
                }
            });
        }

        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                const newExp = {
                    current: req.body.current,
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    description: req.body.description
                }

                // 添加到 开头
                pro.expreience.unshift(newExp);
                pro.save()
                    .then((profile) => {
                        res.json({
                            msg: 'success',
                            result: {
                                profile
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: '添加失败'
                        });
                    });
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '添加失败，没有个人信息，无法添加，请先创建个人信息。'
                });
                console.log(err);
            });
    }],


    /* 
        添加个人教育经历
        1, 验证 token
     */
    'POST /api/profile/education': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const {
            errors,
            isValid
        } = validateEducationInput(req.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                result: {
                    errors
                }
            });
        }

        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                const newEdu = {
                    current: req.body.current,
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    description: req.body.description
                }

                // 添加到开头
                pro.edcation.unshift(newEdu);
                pro.save()
                    .then((profile) => {
                        res.json({
                            msg: 'success',
                            result: {
                                profile
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: '添加失败'
                        });
                        console.log(err);
                    });
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '添加失败，没有个人信息，无法添加，请先创建个人信息。'
                });
                console.log(err);
            });
    }],


    /* 
        删除 个人经历
        1, 验证 token
     */
    'DELETE /api/profile/expreience/:epx_id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                const removeIndex = pro.expreience.map((item) => {
                    return item.id
                }).indexOf(req.params.epx_id);

                if (removeIndex !== -1) {
                    pro.expreience.splice(removeIndex, 1);
                    pro.save()
                        .then((profile) => {
                            res.json({
                                msg: 'success',
                                result: {
                                    profile
                                }
                            });
                        })
                        .catch((err) => {
                            res.status(400).json({
                                msg: 'error',
                                result: '删除失败'
                            });
                            console.log(err);
                        });
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '删除失败, 该 id 找不到对应的数据!'
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '删除失败, 没有个人信息，无法删除!'
                });
                console.log(err);
            });
    }],


    /* 
        删除 个人教育经历
        1, 验证 token
     */
    'DELETE /api/profile/education/:edu_id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                const removeIndex = pro.education.map((item) => {
                    return item.id
                }).indexOf(req.params.edu_id);

                if (removeIndex !== -1) {
                    pro.education.splice(removeIndex, 1);
                    pro.save()
                        .then((profile) => {
                            res.json({
                                msg: 'success',
                                result: {
                                    profile
                                }
                            });
                        })
                        .catch((err) => {
                            res.status(400).json({
                                msg: 'error',
                                result: '删除失败'
                            });
                            console.log(err);
                        });
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '删除失败, 该 id 找不到对应的数据!'
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '删除失败, 没有个人信息，无法删除!'
                });
                console.log(err);
            });
    }],


    /* 
        删除个人信息
        1, 验证 token
     */
    'DELETE /api/profile': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                if (pro === null) {
                    res.status(404).json({
                        msg: 'error',
                        result: '删除失败, 该用户的个人信息尚不存在!'
                    });
                } else {
                    Profile.findOneAndRemove({
                        user: req.user.id
                    })
                    then(() => {
                            res.json({
                                msg: 'success',
                                result: '删除成功'
                            });
                        })
                        .catch((err) => {
                            res.status(404).json({
                                msg: 'error',
                                result: '删除失败'
                            });
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '删除失败, 没有个人信息，无法删除。'
                });
                console.log(err);
            });
    }]
}