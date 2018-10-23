const Validator = require('validator');
const isEmpty = require('./is-empty');

function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.location = !isEmpty(data.location) ? data.location : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = '个人经历的 title 不能为空!';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = '个人经历的 company 不能为空!';
    }

    if (Validator.isEmpty(data.location)) {
        errors.location = '个人经历的 location 不能为空!';
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = '个人经历的 from 不能为空!';
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = '个人经历的 description 不能为空!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateExperienceInput;