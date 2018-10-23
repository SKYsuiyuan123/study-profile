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


/*
    先验证 token
*/
module.exports = {
    // 创建个人简介
    'POST /api/profile': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const {
            errors,
            isValid
        } = validateProfileInput(req.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                errors,
                result: '创建失败。'
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

        if (req.body.githubusername) {
            profileFields.githubusername = req.body.githubusername;
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
                                    result: errors
                                });
                            } else {
                                new Profile(profileFields).save().then((pro) => {
                                    res.json({
                                        msg: 'success',
                                        result: pro
                                    })
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }
                        })
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '个人信息已存在，无法重新创建'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }],


    // 编辑个人简介
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

        if (req.body.githubusername) {
            profileFields.githubusername = req.body.githubusername;
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
                        .then((pro) => {
                            res.json({
                                msg: 'success',
                                result: pro
                            })
                        })
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '个人信息不存在，无法修改'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }],


    // 获取当前登录用户的个人简介  Private
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
                        result: '该用户信息不存在!'
                    })
                } else {
                    res.json({
                        msg: 'success',
                        result: pro
                    });
                }
            })
            .catch(err => {
                res.status(404).json(err);
                console.log(err);
            });
    }],


    // 根据 handle 获取个人简介 Public
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
                        result: pro
                    });
                }
            })
            .catch(err => {
                res.status(404).json(err);
                console.log(err);
            })
    }],


    // 根据 user_id 获取个人简介  Public
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
                        result: pro
                    });
                }
            })
            .catch(err => {
                res.status(404).json(err);
                console.log(err);
            })
    }],


    // 获取所有人的个人简介  Public
    'GET /api/profile/all': [(req, res) => {
        Profile.find()
            .populate('user', ['name', 'avatart', 'email'])
            .then((pros) => {
                if (!pros) {
                    // 不存在
                    return res.status(404).json({
                        msg: 'error',
                        result: '没有任何用户信息!'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        result: pros
                    });
                }
            })
            .catch(err => {
                res.status(404).json(err);
                console.log(err);
            });
    }],


    // 添加个人经历  Private
    'POST /api/profile/experience': [passport.authenticate('jwt', {
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
                errors,
                result: '添加失败。'
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
                pro.experience.unshift(newExp);
                pro.save().then((profile) => {
                        res.json({
                            msg: 'success',
                            result: profile
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: '添加失败'
                        });
                    })
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '添加失败,没有个人简介。请先创建个人简介。'
                });
                console.log(err);
            })
    }],


    // 添加个人教育经历  Private
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
                errors,
                result: '添加失败。'
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

                // 添加到 开头
                pro.education.unshift(newEdu);
                pro.save().then((profile) => {
                        res.json({
                            msg: 'success',
                            result: profile
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: '添加失败'
                        });
                    })
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '添加失败,没有个人简介。请先创建个人简介。'
                });
                console.log(err);
            })
    }],


    // 删除个人经历  Private
    'DELETE /api/profile/experience/:epx_id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                const removeIndex = pro.experience.map((item) => {
                    return item.id
                }).indexOf(req.params.epx_id);
                if (removeIndex !== -1) {
                    pro.experience.splice(removeIndex, 1);
                    pro.save()
                        .then((profile) => {
                            res.json({
                                msg: 'success',
                                result: profile
                            });
                        })
                        .catch((err) => {
                            res.status(400).json({
                                msg: 'error',
                                result: '删除失败'
                            });
                            console.log(err);
                        })
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '删除失败,该 id 找不到对应的数据'
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '删除失败,没有个人简介。'
                });
                console.log(err);
            });
    }],


    // 删除个人教育经历  Private
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
                                result: profile
                            });
                        })
                        .catch((err) => {
                            res.status(400).json({
                                msg: 'error',
                                result: '删除失败'
                            });
                            console.log(err);
                        })
                } else {
                    res.status(400).json({
                        msg: 'error',
                        result: '删除失败,该 id 找不到对应的数据'
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '删除失败,没有个人简介。'
                });
                console.log(err);
            });
    }],


    // 删除个人 信息  Private
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
                        result: '删除失败, 该用户个人信息不存在'
                    });
                } else {
                    Profile.findOneAndRemove({
                            user: req.user.id
                        })
                        .then(() => {
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
                    result: '删除失败,没有个人简介。'
                });
                console.log(err);
            });
    }]
}