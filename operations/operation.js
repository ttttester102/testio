var connection = require("./connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    AUTH_USER_DATA,
    NOT_AUTHORIZED,
    SOCIAL_MEDIA_LOGIN,
    APP_SEARCH_RADIUS
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
                    else close(client, NOT_AUTHORIZED, {
                        message: "Either username or password is incorrect."
                    }, cb);
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
            var { username, password, mobile_number, email } = obj;
            randomPassword(username, password, (password, slug) => {
                collection.find({ username }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length === 0) {
                        generateToken(username, (userAccessToken, data) => {
                            if (userAccessToken) {
                                collection.insertOne({
                                    username,
                                    email,
                                    userAccessToken,
                                    password,
                                    mobile_number,
                                    deletedStatus: 0,
                                    status: 0,
                                    slug
                                }).then((data) => {
                                    getCollection(collection, { username }, { password: 0, slug: 0 }, client, cb);
                                });
                            } else close(client, ERROR, {
                                message: "Unable to generate access token, please try again."
                            }, cb);
                        })
                    } else close(client, PRESENT, {}, cb);
                });
            })
        }
    })
}

/**
 * Post report
 * @param {*object} obj 
 * @param {*function} cb 
 */
var socialLogin = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { social_media_name, social_media_id } = obj;
            collection.find({ username: social_media_id }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length === 0) {
                    generateToken(social_media_id, (userAccessToken, data) => {
                        if (userAccessToken) {
                            collection.insertOne({
                                username: social_media_id,
                                name: social_media_name,
                                userAccessToken,
                                loginType: SOCIAL_MEDIA_LOGIN,
                                deletedStatus: 0,
                                status: 0
                            }).then((data) => {
                                getCollection(collection, { username: social_media_id }, { password: 0, slug: 0 }, client, cb);
                            });
                        } else close(client, ERROR, {
                            message: "Unable to generate access token, please try again."
                        }, cb);
                    })
                } else if (data && data.length === 1) {
                    getCollection(collection, { username: social_media_id }, { password: 0, slug: 0 }, client, cb);
                } else close(client, NOVALUE, {}, cb);
            });
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
 * Forgot password
 */
var forgotPassword = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { username } = obj;
            collection.find({ username }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    const user = data[0];

                    if (user && user.email) {
                        close(client, SUCCESS, data[0], cb);
                    } else close(client, NOVALUE, {
                        message: "User email is not present."
                    }, cb);
                } else close(client, NOVALUE, {
                    message: "User data is not available"
                }, cb);
            });
        }
    })
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
            const { _id, mobile_number, social_media_name, about_me, hair_color, eye_color, occupation, what_he_is_looking_for, relationship_status, isPrivate, profile_image_url, ethniicty, body_type, education, children, smokes, drinks, location, looking_for, lifestyle_expectation, height } = obj;
            collection.updateOne({ _id: new ObjectId(_id) }, {
                $set: {
                    mobile_number,
                    social_media_name,
                    about_me,
                    hair_color,
                    eye_color,
                    occupation,
                    what_he_is_looking_for,
                    relationship_status,
                    isPrivate,
                    profile_image_url,
                    ethniicty,
                    body_type,
                    education,
                    children,
                    smokes,
                    drinks,
                    location,
                    looking_for,
                    lifestyle_expectation,
                    height
                }
            }).then((data) => {
                if (!data) close(client, ERROR, err, cb);
                else getCollection(collection, { _id: new ObjectId(_id) }, { password: 0, slug: 0 }, client, cb);
            });
        }
    })
}

/** 
 *  Search near by users
 */
var search = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { latitude, longitude, name, email, radius, page, page_size } = obj;
            let _radius = radius ? radius : APP_SEARCH_RADIUS;

            collection.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [longitude, latitude] },
                        distanceField: "distance",
                        distanceMultiplier: 0.001
                    }
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $lte: ["$distance", _radius] },
                                name && email ?
                                    {
                                        $or: [
                                            { $ne: [{ $indexOfCP: ["$username", name ? name : ''] }, -1] },
                                            { $ne: [{ $indexOfCP: ["$email", email ? email : ''] }, -1] }
                                        ]
                                    } : {}
                            ]
                        }
                    }
                },
                {
                    $project: {
                        "distance": 1,
                        "username": 1,
                        "email": 1,
                        "indexdata": {

                            $cond: {

                                if: { $ne: [{ $indexOfCP: ["$username", name ? name : ''] }, -1] }, then: { $indexOfCP: ["$username", name ? name : ''] }, else: { $indexOfCP: ["$email", email ? email : ''] }

                            }

                        }
                    }
                },
                { $skip: page * page_size },
                { $limit: page_size }
            ]).then((data) => {
                if (!data) close(client, ERROR, err, cb);
                else getCollection(collection, { _id: new ObjectId(_id) }, { password: 0, slug: 0 }, client, cb);
            });
        }
    })
}



module.exports = {
    login,
    socialLogin,
    signup,
    getCollection,
    verifyJsonToken,
    editUserProfile,
    forgotPassword,
    searchValue
}







//Search api query
// db.getCollection('users').aggregate([
//     {
//         $geoNear: {
//             near: { type: "Point", coordinates: [76.7179, 30.7046] },
//             distanceField: "distance",
//             distanceMultiplier: 0.001
//         }
//     },
//     {
//         $match: {
//             $expr: {
//                 $and: [
//                     { $lte: ["$distance", 40] },
//                     {
//                         $or: [
//                             { $ne: [{ $indexOfCP: ["$username", "gmail"] }, -1] },
//                             { $ne: [{ $indexOfCP: ["$email", "gmail"] }, -1] }
//                         ]
//                     }
//                 ]
//             }
//         }
//     },
//     {
//         $project: {
//             "distance": 1,
//             "username": 1,
//             "email": 1,
//             "indexdata": {

//                 $cond: {

//                     if: { $ne: [{ $indexOfCP: ["$username", "gmail"] }, -1] }, then: { $indexOfCP: ["$username", "gmail"] }, else: { $indexOfCP: ["$email", "gmail"] }

//                 }

//             }
//         }
//     },
//     { $skip: 0 },
//     { $limit: 12 }
// ]);