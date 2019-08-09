var connection = require("./connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    AUTH_USER_DATA
} = require("./constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword
} = require("./common");
var jwt = require('jsonwebtoken');
var common = require("../operations/common");

/**
 * Post report
 * @param {*object} obj 
 * @param {*function} cb 
 */
var login = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { username, password } = obj;
            randomPassword(username, password, (password, slug) => {
                collection.find({ username, password }, {
                    projection: {
                        password: 0,
                        slug: 0
                    }
                }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length !== 0) {
                        const { userAccessToken, ...rest } = data[0];
                        jwt.sign({ ...rest }, userAccessToken, (err, token) => {
                            if (err) close(client, ERROR, err, cb);
                            else close(client, SUCCESS, {
                                ...rest,
                                user_token: token
                            }, cb);
                        });
                    }
                    else close(client, NOVALUE, err, cb);
                });
            });
        }
    })
}

/**
 * Post report
 * @param {*object} obj 
 * @param {*function} cb 
 */
var signup = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { username, password, mobile_number, social_media_name, social_media_id } = obj;
            randomPassword(username, password, (password, slug) => {
                collection.find({ username }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length === 0) {
                        generateToken(username, (userAccessToken, data) => {
                            if (userAccessToken) {
                                collection.insertOne({
                                    username,
                                    userAccessToken,
                                    password,
                                    mobile_number,
                                    social_media_name,
                                    social_media_id,
                                    deletedStatus: 0,
                                    status: 0,
                                    slug
                                }).then((data) => {
                                    getCollection(collection, { username }, { password: 0, slug: 0 }, client, cb);
                                });
                            } else close(client, ERROR, {}, cb);
                        })
                    } else close(client, PRESENT, {}, cb);
                });
            })
        }
    })
}

/** 
 * Get Collection data with respective find object
 */
var getCollection = (collection, query, projection, client, cb) => {
    collection.find(query, { projection }).toArray((err, data) => {
        if (err) close(client, ERROR, err, cb);
        else if (data && data.length !== 0) {
            const { userAccessToken, token, ...rest } = data[0];
            jwt.sign({ ...rest }, userAccessToken, (err, token) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    close(client, SUCCESS, {
                        ...rest,
                        user_token: token
                    }, cb);
                }
            });
        } else close(client, NOVALUE, {}, cb);
    });
}

/** Verify json token */
var verifyJsonToken = (req, res, next) => {
    const { user_token } = req.body;

    const { payload } = jwt.decode(user_token, {
        complete: true
    });

    getUserViaId(payload, (status, response) => {
        if (status === SUCCESS) {
            const { userAccessToken, ...rest } = response;
            jwt.verify(user_token, userAccessToken, (err, decoded) => {
                if (err) common.httpResponse(req, res, ERROR, err);
                else {
                    req[AUTH_USER_DATA] = decoded;
                    next();
                }
            });
        } else common.httpResponse(req, res, NOVALUE, response);
    });
}

/** 
 * Get user via id
 */
var getUserViaId = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { _id } = obj;
            collection.find({ _id: new ObjectId(_id) }, {
                projection: {
                    password: 0,
                    slug: 0
                }
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    close(client, SUCCESS, data[0], cb);
                }
                else close(client, NOVALUE, err, cb);
            });
        }
    })
}

/** 
 * Edit user profile
 */
var editUserProfile = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { _id, mobile_number, social_media_name, about_me, hair_color, eye_color, occupation, what_he_is_looking_for, relationship_status, isPrivate, profile_image_url } = obj;
            collection.updateOne({ _id: new ObjectId(_id) }, {
                $set: {
                    mobile_number: mobile_number,
                    social_media_name: social_media_name,
                    about_me: about_me,
                    hair_color: hair_color,
                    eye_color: eye_color,
                    occupation: occupation,
                    what_he_is_looking_for: what_he_is_looking_for,
                    relationship_status: relationship_status,
                    isPrivate: isPrivate,
                    profile_image_url: profile_image_url
                }
            }).then((data) => {
                if (!data) close(client, ERROR, err, cb);
                else getCollection(collection, { _id: new ObjectId(_id) }, { password: 0, slug: 0 }, client, cb);
            });
        }
    })
}



module.exports = {
    login,
    signup,
    getCollection,
    verifyJsonToken,
    editUserProfile
}