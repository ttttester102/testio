var crypto = require('crypto');
var md5 = require('md5');
var moment = require('moment');
var apiKeys = require('./config');
var {
    NOT_VALID,
    SUCCESS,
    SUCCESS_WITH_EMAIL_CHANGE,
    ERROR,
    PRESENT,
    NOVALUE,
    OBJECT_EMPTY,
    TOKEN_ERROR,
    VALIDATE_ERROR,
    VARIFICATION_ERROR,
    LIKE,
    UNLIKE,
    VOTE,
    UNVOTE,
    BASE_URL,
    EMAIL_PRESENT,
    LOGED_IN,
    LOGED_OUT,

    CLIENT_DENYING_BOOKING,
    LAWYER_DENYING_BOOKING,

    BOOKING_STATUS_ACTIVE,
    BOOKING_STATUS_PENDING,

    CLIENT_BOOKING_REQUEST_VIEWED_LAWYER_STATUS_ACTIVE,
    LAWYER_BOOKING_ACCEPTED_VIEWED_CLIENT_STATUS_ACTIVE,

    LAWYER,
    CLIENT,

    NO_CHANGE,
    CHANGE,
    TYPES,
    ERROR_FIELDS_EMPTY,
    ERROR_TYPE_MISMATCHED,
    APP_KEY
} = require('./constant');

var isObjectEmpty = function (obj, cb = undefined) {
    let names = Object.getOwnPropertyNames(obj);
    cb && cb((names.length === 0) ? true : false, names);

    if (!cb) return (names.length === 0) ? true : false;
}

/**
 * Check for, is data array format?
 * @param {*object} obj 
 * @param {*function} cb 
 */
var isDataArray = function isDataArray(obj, cb) {
    cb(obj.length !== undefined ? true : false);
}

/**
 * For sorting
 * @param {*any} a 
 * @param {*any} b 
 */
var compare = function (a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

/**
 * Validate email address
 * @param {*string} email 
 */
var validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Random password
 * @param {*string} username 
 * @param {*string} given_password 
 * @param {*function} cb 
 */
var randomPassword = function (username, given_password, cb) {
    var pasword = Math.random().toString();
    var temp = pasword.match(/[1-9]/g);
    var pass = '';
    for (var i = 0; i < 7; i++) {
        pass += temp[i];
    }

    if (given_password !== null && given_password !== '' && given_password !== undefined) {
        var encrypt = '';
        var cipher = crypto.createCipher('aes192', username)
            .on('readable', function () {
                var data = cipher.read();
                if (data) {
                    encrypt += data.toString('hex');
                }
            })
            .on('end', function () {
                cb(encrypt.toString('hex'), username);
            });
        cipher.write(given_password);
        cipher.end();

    } else {

        var encrypt = '';
        var cipher = crypto.createCipher('aes192', username)
            .on('readable', function () {
                var data = cipher.read();
                if (data) {
                    encrypt += data.toString('hex');
                    // cb(data.toString('hex'), username);
                }
            })
            .on('end', function () {
                cb(encrypt.toString('hex'), username);
            });;
        cipher.write(pass);
        cipher.end();
    }
}

/**
 * Random token
 * @param {*string} username 
 */
var generateToken = function (username, cb) {

    var tempToken = Math.floor(Math.random() * 1000000000) + '';

    var encrypt = '';
    var cipher = crypto.createCipher('aes192', username)
        .on('readable', function () {
            var data = cipher.read();
            if (data) {
                encrypt += data.toString('hex');
            }
        })
        .on('end', function () {
            cb(encrypt, username);
        });
    cipher.write(tempToken);
    cipher.end();
}

/**
 * Decrypt the data
 * @param {*string} username 
 * @param {*string} password 
 * @param {*function} cb 
 */
var decryptData = function (username, password, cb) {
    if (password) {
        var decipher = crypto.createDecipher('aes192', username)
            .on('readable', function () {
                var data = decipher.read();
                if (data) {
                    cb(data.toString('utf8'));
                }
            });
        decipher.write(password, 'hex');
        decipher.end();
    }
}

/**
 * Make My Match response while operation has done
 * @param {*request} req 
 * @param {*response} res 
 * @param {*string} status 
 * @param {*array|object} response 
 */
var httpResponse = function (req, res, status, response) {
    switch (status) {
        case 'success':
            res.status(200)
                .json({
                    status: 200,
                    code: 1,
                    data: response,
                    message: "Success",
                    emptyKeys: null,
                    error: false
                })
            break;
        case 'successWithEmailChange':
            res.status(200)
                .json({
                    status: 200,
                    code: 1,
                    data: response,
                    message: "SuccessWithEmailChange",
                    emptyKeys: null,
                    error: false
                })
            break;
        case 'err':
            res.status(501)
                .json({
                    status: 501,
                    code: 1,
                    data: response,
                    message: "Error",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'notValid':
            res.status(401)
                .json({
                    code: 1,
                    status: 401,
                    data: response,
                    message: "NotValid",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'notChanged':
            res.status(404)
                .json({
                    code: 1,
                    status: 404,
                    data: response,
                    message: "NotValid",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'present':
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "Present",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'noValue':
            res.status(404)
                .json({
                    code: 1,
                    status: 404,
                    data: response,
                    message: "NoValue",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'notAuthorized':
            res.status(401)
                .json({
                    code: 1,
                    status: 401,
                    data: response,
                    message: "Not Authorized",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'objEmpty':
            res.status(400)
                .json({
                    code: 1,
                    status: 400,
                    data: [],
                    message: "ObjEmpty",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'badRequest':
            res.status(400)
                .json({
                    code: 1,
                    status: 400,
                    data: response,
                    message: "Bad REQUEST",
                    emptyKeys: null,
                    error: true
                })
            break;
        case "validationErr":
            res.status(422)
                .json({
                    code: 1,
                    status: 422,
                    data: [],
                    message: "ValidationError",
                    emptyKeys: response,
                    error: true
                })
            break;
        case "verificationErr":
            res.status(304)
                .json({
                    code: 1,
                    status: 304,
                    data: [],
                    message: "VarificationError",
                    emptyKeys: response,
                    error: true
                })
            break;
        case "emailPresent":
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "EmailPresent",
                    emptyKeys: [],
                    error: true
                })
            break;
        case "forbidden":
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "FORBIDDEN",
                    emptyKeys: [],
                    error: true
                })
            break;
        case "logedIn":
            res.status(200)
                .json({
                    code: 1,
                    status: 200,
                    data: response,
                    message: "LogedIn",
                    emptyKeys: [],
                    error: false
                })
            break;
        case "logedOut":
            res.status(200)
                .json({
                    code: 1,
                    status: 200,
                    data: response,
                    message: "LogedOut",
                    emptyKeys: [],
                    error: false
                })
            break;
        default:
            res.status(500)
                .json({
                    code: 1,
                    status: 500,
                    data: [],
                    message: "InternalServerError",
                    emptyKeys: null,
                    error: true
                })
    }
}

/**
 * Civic response while operation has done
 * @param {*string} status 
 * @param {*array|object} response 
 */
var socketResponse = function (status, response) {
    switch (status) {
        case 'success':
            return {
                status: 200,
                code: 1,
                data: response,
                message: "Success",
                emptyKeys: null,
                error: false
            };
        case 'err':
            return {
                status: 400,
                code: 1,
                data: [],
                message: "Error",
                emptyKeys: null,
                error: false
            };
        case 'notValid':
            return {
                code: 1,
                status: 401,
                data: [],
                message: "NotValid",
                emptyKeys: null,
                error: false
            };
        case 'present':
            return {
                code: 1,
                status: 400,
                data: response,
                message: "Present",
                emptyKeys: null,
                error: false
            };
        case 'noValue':
            return {
                code: 1,
                status: 400,
                data: response,
                message: "NoValue",
                emptyKeys: null,
                error: false
            };
        case 'objEmpty':
            return {
                code: 1,
                status: 400,
                data: [],
                message: "ObjEmpty",
                emptyKeys: null,
                error: false
            };
        case "validationErr":
            return {
                code: 1,
                status: 400,
                data: [],
                message: "ValidationError",
                emptyKeys: response,
                error: false
            };
        case "verificationErr":
            return {
                code: 1,
                status: 401,
                data: [],
                message: "VarificationError",
                emptyKeys: response,
                error: false
            };
        case "emailPresent":
            return {
                code: 1,
                status: 200,
                data: response,
                message: "EmailPresent",
                emptyKeys: [],
                error: false
            };
        default:
            return {
                code: 1,
                status: 500,
                data: [],
                message: "InternalServerError",
                emptyKeys: null,
                error: false
            };
    }
}

/**
 * Check for, is data array format?
 * @param {*object} obj 
 * @param {*function} cb 
 */
var close = function (client, status, response, cb) {
    if (client) {
        client.close();
        cb(status, response);
    } else {
        cb(status, response);
    }
}

/**
 * Merge objects
 * @param {*object} obj 
 * @param {*function} oldObj 
 */
var mergeObject = function (obj, oldObj) {
    return Object.assign(obj, oldObj)
}

/**
 * Check value type
 * @param {*object} obj 
 * @param {*any} obj 
 */
var isTypeMatched = function (ele, value) {
    if (!ele || (ele && !ele.type)) return false;
    if (!ele.isRequired && !value && value !== 0 && typeof value !== undefined && value !== null) return true;
    if (!value && value !== 0 && typeof value !== undefined && value !== null) return false;

    switch (ele.type.toLowerCase()) {
        case "string":
            return (typeof value === "string" || value === undefined || value === null) ? true : false;
        case "number":
            return (typeof value === "number" || value === undefined || value === null) ? true : false;
        case "boolean":
            return (typeof value === "boolean" || value === undefined || value === null) ? true : false;
        case "object":
            return (typeof value === "object" && !Array.isArray(value) || value === undefined || value === null) ? true : false;
        case "array":
            return (typeof value === "object" && Array.isArray(value) || value === undefined || value === null) ? true : false;
        case "any":
            return true;
        default:
            return false;
    }
}

/**
 * Get authorization token
 */
var getAuthoriztionToken = () => {
    return md5(`${APP_KEY}${md5(moment(new Date()).format('DD-MM-YYYY'))}`);
}

/**
 * Validate the request 
 * @param {*object} obj 
 */
var validate = function (key, obj, cb) {
    try {
        isObjectEmpty(obj, (status, names) => {
            if (!status) {
                var existedFields = {
                    keys: names,
                    emptyKeys: []
                }
                var misMatchedValues = apiKeys.routesFields[key].filter(ele => TYPES.findIndex(type => {
                    return ele.type.toLowerCase() === type.toLowerCase() && isTypeMatched(ele, obj[ele.key]);
                }) === -1);

                if (misMatchedValues && misMatchedValues.length) {
                    cb(false, {
                        error: ERROR_TYPE_MISMATCHED,
                        message: misMatchedValues.map(ele => ({
                            fieldName: ele.key,
                            type: ele.type
                        }))
                    });
                    return;
                }
                apiKeys.routesFields[key].forEach((element, index) => {
                    switch (element.type.toLowerCase()) {
                        case "string":
                            !obj[element.key] && element.isRequired && existedFields.emptyKeys.push({ fieldName: element.key, message: element.key + " field is empty" });
                            break;
                        case "number":
                            (!Math.abs(obj[element.key]) && obj[element.key] !== 0) && element.isRequired && existedFields.emptyKeys.push({ fieldName: element.key, message: element.key + " field is empty" });
                            break;
                        case "boolean":
                            !obj[element.key] && element.isRequired && existedFields.emptyKeys.push({ fieldName: element.key, message: element.key + " field is empty" });
                            break;
                        case "array":
                            (!obj[element.key] || obj[element.key] && !obj[element.key].length) && element.isRequired && existedFields.emptyKeys.push({ fieldName: element.key, message: element.key + " field is empty" });
                            break;
                        case "object":
                            isObjectEmpty(obj[element.key]) && element.isRequired && existedFields.emptyKeys.push({ fieldName: element.key, message: element.key + " field is empty" });
                            break;
                        default:
                            !obj[element.key] && element.isRequired && existedFields.emptyKeys.push({ fieldName: element.key, message: element.key + " field is empty" });
                    }
                });

                //Specific fields validations
                existedFields.emptyKeys.length <= 0 &&
                    existedFields.keys.forEach((element) => {
                        switch (element) {
                            case "email":
                                !validateEmail(obj["email"]) && existedFields.emptyKeys.push({ fieldName: element.key, message: "Email address is not valid." });
                                break;
                            case "confirm_password":
                                obj["password"] !== obj["confirm_password"] && existedFields.emptyKeys.push({ fieldName: ["password", "confirm_password"], message: "Password is not matched." });
                                break;
                        }
                    });

                cb(existedFields.emptyKeys.length > 0 ? false : true, existedFields.emptyKeys);
            } else cb(false, apiKeys.routesFields[key] && apiKeys.routesFields[key].length ? apiKeys.routesFields[key].map(ele => ({ fieldName: ele.key, type: ele.type })) : apiKeys.routesFields[key]);
        })
    } catch (error) {
        console.log("error ===> ", error);
    }
}

module.exports = {
    isObjectEmpty,
    isDataArray,
    compare,
    validateEmail,
    randomPassword,
    generateToken,
    decryptData,
    httpResponse,
    socketResponse,
    close,
    validate,
    mergeObject,
    getAuthoriztionToken
}