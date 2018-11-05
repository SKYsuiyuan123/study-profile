const Validator = require('validator');
const isEmpty = require('./is-empty');


function validatePostsInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';
    data.name = !isEmpty(data.name) ? data.name : '';

    if (!Validator.isLength(data.text, {
            min: 10,
            max: 300
        })) {
        errors.text = '评论不能少于 10 个字符，且不能大于 300 个!';
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = '文本不能为空!';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = '名字不能为空!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


module.exports = validatePostsInput;