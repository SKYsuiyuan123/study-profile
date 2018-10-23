const passport = require('passport');
require('../config/passport')(passport);


// 引入 点赞模型
const Posts = require('../models/post');
// 引入 信息模型
const Profile = require('../models/profiles');
// 引入 用户模型
// const User = require('../models/user');

// 引入验证方法
const validatePostsInput = require('../validation/post');

module.exports = {
    // 添加评论内容
    'POST /api/posts': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const {
            errors,
            isValid
        } = validatePostsInput(req.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                errors,
                result: '添加失败。'
            });
        }

        const newPost = new Posts({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id,
        });

        newPost.save()
            .then((post) => {
                res.json({
                    msg: 'success',
                    result: post
                });
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '添加评论失败。'
                });
                console.log(err);
            })
    }],


    // 获取评论内容
    'GET /api/posts': [(req, res) => {
        Posts.find().sort({
                date: 1
            })
            .then((posts) => {
                res.json({
                    msg: 'success',
                    result: posts
                });
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '未找到任何评论信息'
                });
                console.log(err);
            });
    }],


    // 根据 评论Id 获取单个评论内容
    'GET /api/posts/:id': [(req, res) => {
        Posts.findById(req.params.id)
            .then((post) => {
                if (post === null) {
                    res.status(404).json({
                        msg: 'error',
                        result: '找不到该 id 对应的评论'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        result: post
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    msg: 'error',
                    result: '找不到该 id 对应的评论'
                });
                console.log(err);
            });
    }],


    // 根据 评论 Id 删除 单个评论内容
    'DELETE /api/posts/:id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                Posts.findById(req.params.id)
                    .then((post) => {
                        if (post.user.toString() !== req.user.id) {
                            // 判断是否是本人
                            return res.status(401).json({
                                notauthorized: '用户非法操作!'
                            })
                        } else {
                            post.remove()
                                .then(() => {
                                    res.json({
                                        msg: 'success',
                                        result: '删除成功'
                                    });
                                })
                                .catch((err) => {
                                    res.status(400).json({
                                        msg: 'error',
                                        result: '删除失败'
                                    });
                                    console.log(err);
                                });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: '删除失败，未找到用户'
                        });
                        console.log(err);
                    });
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '找不到该用户'
                });
                console.log(err);
            });
    }],


    // 点赞
    // id: 评论的id（posts的Id）
    'POST /api/posts/like/:id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                Posts.findById(req.params.id)
                    .then((post) => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                            return res.status(400).json({
                                msg: 'error',
                                result: '该用户已点过赞了。'
                            });
                        } else {
                            post.likes.unshift({
                                user: req.user.id
                            });
                            post.save()
                                .then((post) => {
                                    res.json({
                                        msg: 'success',
                                        result: '点赞成功。'
                                    });
                                })
                                .catch((err) => {
                                    res.status(400).json({
                                        msg: 'error',
                                        result: '点赞错误。'
                                    });
                                    console.log(err);
                                });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: 'post 数据查找错误。'
                        });
                        console.log(err);
                    })
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '用户信息查找错误。'
                });
                console.log(err);
            })
    }],


    // 取消点赞
    // id: 评论的id（posts的Id）
    'POST /api/posts/unlike/:id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then((pro) => {
                Posts.findById(req.params.id)
                    .then((post) => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                            return res.status(400).json({
                                msg: 'error',
                                result: '该用户暂未点赞，无法取消点赞。'
                            });
                        } else {

                            // 获取要删掉的 user_Id
                            const removeIndex = post.likes.map((item) => {
                                return item.user.toString();
                            }).indexOf(req.user.id);

                            post.likes.splice(removeIndex, 1);
                            post.save()
                                .then((post) => {
                                    res.json({
                                        msg: 'success',
                                        result: '取消点赞成功。'
                                    });
                                })
                                .catch((err) => {
                                    res.status(400).json({
                                        msg: 'error',
                                        result: '取消点赞错误。'
                                    });
                                    console.log(err);
                                });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: 'post 数据查找错误。'
                        });
                        console.log(err);
                    })
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '用户信息查找错误。'
                });
                console.log(err);
            })
    }],


    // 添加评论
    // id: 评论的id（posts的Id）
    'POST /api/posts/comment/:id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        const {
            errors,
            isValid
        } = validatePostsInput(req.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            return res.status(400).json({
                msg: 'error',
                errors,
                result: '添加失败。'
            });
        }

        Posts.findById(req.params.id)
            .then((post) => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                }

                post.comments.unshift(newComment);
                post.save()
                    .then((post) => {
                        res.json({
                            msg: 'success',
                            result: '添加评论成功'
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: 'error',
                            result: '添加评论失败。'
                        });
                        console.log(err);
                    })
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '未找到评论信息。'
                });
                console.log(err);
            });
    }],


    // 删除评论
    // id: 评论的id（posts的Id）
    'DELETE /api/posts/comment/:id/:comment_id': [passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Posts.findById(req.params.id)
            .then((post) => {
                if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
                    return res.status(404).json({
                        msg: 'error',
                        result: '该评论不存在。'
                    });
                } else {
                    const removeIndex = post.comments.map((item) => {
                        return item._id.toString()
                    }).indexOf(req.params.comment_id);

                    post.comments.splice(removeIndex, 1);
                    post.save()
                        .then((post) => {
                            res.json({
                                msg: 'success',
                                result: '删除评论成功'
                            });
                        })
                        .catch((err) => {
                            res.status(400).json({
                                msg: 'error',
                                result: '删除评论失败。'
                            });
                            console.log(err);
                        })
                }
            })
            .catch((err) => {
                res.status(400).json({
                    msg: 'error',
                    result: '未找到评论信息。'
                });
                console.log(err);
            });
    }]
}