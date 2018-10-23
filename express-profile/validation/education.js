const Validator = require('validator');
const isEmpty = require('./is-empty');

function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = '教育经历的 school 不能为空!';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = '教育经历的 degree 不能为空!';
    }

    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = '教育经历的 fieldofstudy 不能为空!';
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = '教育经历的 from 不能为空!';
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = '教育经历的 description 不能为空!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateEducationInput;