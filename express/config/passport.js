const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('users');

// 引入 加密名字
const keys = require('../config/keys');


let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


// 导出 passport 验证
module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then((user) => {
                return user ? done(null, user) : done(null, false);
            })
            .catch((err) => {
                console.log(err);
            })
    }));
}