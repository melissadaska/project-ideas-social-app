const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string === '') return true;
    else return false;
};

exports.validateSignUpData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Email cannot be empty'
    } else if(!isEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(data.password)) {
        errors.password = 'Cannot be empty'
    }
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email))
        errors.email = 'Email cannot be empty';
    
    if(isEmpty(data.password))
        errors.password = 'Cannot be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio)) userDetails.bio = data.bio;
    if(!isEmpty(data.website)){
        if(data.website.substring(0, 4) !== 'http'){
            userDetails.website = `https://${data.website}`;
        } else userDetails.website = data.website;
    }
    if(!isEmpty(data.location)) userDetails.location = data.location;

    return userDetails;
};
