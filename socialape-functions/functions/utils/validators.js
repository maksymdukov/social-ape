const isEmpty = (string) => string.trim() === '' ? true : false;

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(emailRegEx)) return false;
    return true;
}

const validateSignupInput = (date) => {
    const errors = {};
    if (isEmpty(date.email)) {
        errors.email = 'Must not be empty ';
    } else if (!isEmail(date.email)) {
        errors.email = 'Must be a valid email'
    }

    if (isEmpty(date.password)) errors.password = 'Must not be empty';
    if (date.password !== date.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if (isEmpty(date.handle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

const validateLoginInput = (data) => {
    let errors = {};
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

const reduceUserDetails = (data) => {
    let userDetailes = {};

    if (!isEmpty(data.bio.trim())) userDetailes.bio = data.bio.trim();
    if (!isEmpty(data.website.trim())) {
        if (data.website.trim().substring(0, 4) !== 'http') {
            userDetailes.website = `http://${data.website.trim()}`;
        } else userDetailes.website = data.website.trim();
    }
    if (!isEmpty(data.location.trim())) userDetailes.location = data.location.trim();
    return userDetailes;
}

module.exports = {
    reduceUserDetails,
    validateSignupInput,
    validateLoginInput,
    isEmpty,
    isEmail
};