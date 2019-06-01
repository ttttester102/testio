var connection = require("./connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT
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
                collection.find({ username, password }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length !== 0) close(client, SUCCESS, data[0], cb);
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
            var { username, password, mobile_number } = obj;
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
        else if (data && data.length !== 0) close(client, SUCCESS, data[0], cb);
        else close(client, NOVALUE, {}, cb);
    });
}

module.exports = {
    login,
    signup,
    getCollection
}