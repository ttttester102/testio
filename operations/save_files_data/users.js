var connection = require("../connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    AUTH_USER_DATA,
    USERS_CSV_JSON_DATA
} = require("../constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword
} = require("../common");
var jwt = require('jsonwebtoken');
var common = require("../../operations/common");

var moldeUserData = (req, res, next) => {
    var count = 0;
    const csvJsonData = req.csvJsonData;
    csvJsonData.forEach((ele, index) => {
        const { username, password } = ele;
        randomPassword(username, password, (password, slug) => {
            generateToken(username, (userAccessToken, data) => {
                const index = csvJsonData.findIndex(ele => ele.username === slug);
                if (index !== -1) {
                    csvJsonData[index].password = password;
                    csvJsonData[index].userAccessToken = userAccessToken;
                    csvJsonData[index].deletedStatus = 0;
                    csvJsonData[index].status = 0;
                    csvJsonData[index].slug = slug;
                    csvJsonData[index].location = {
                        type: "Point",
                        coordinates: [ele.latitude, ele.longitude]
                    };
                }

                const { password: passwordData, userAccessToken: accessToken, slug: slugData, ...rest } = csvJsonData[index];
                jwt.sign({ ...rest }, userAccessToken, (err, token) => {
                    csvJsonData[index].user_token = token;

                    if (csvJsonData && count === csvJsonData.length - 1) {
                        const tempCsvJsonData = csvJsonData.map((ele) => {
                            const { latitude, longitude, ...rest } = ele;
                            return ({ ...rest });
                        });
                        req[USERS_CSV_JSON_DATA] = tempCsvJsonData;
                        next();
                    }

                    count += 1;
                });
            })
        });
    });
}

/**
 * Post report
 * @param {*object} obj 
 * @param {*function} cb 
 */
var multiUsresSignup = function (users, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            collection.insertMany(users).then((err, res) => {
                if (err) close(client, ERROR, err, cb);
                else close(client, SUCCESS, res, cb);
            });
        }
    })
}

/**
 * Edit users data
 * @param {*object} users 
 * @param {*function} cb 
 */
var editUsersData = (req, res, next) => {
    var count = 0;
    const csvJsonData = req.csvJsonData;
    csvJsonData.forEach((ele) => {
        const {
            username,
            mobile_number,
            about_me,
            hair_color,
            eye_color,
            occupation,
            what_he_is_looking_for,
            relationship_status,
            isPrivate,
            latitude,
            longitude,
            profile_image_url
        } = ele;


        const index = csvJsonData.findIndex(ele => ele.username === username);
        if (index !== -1) {
            csvJsonData[index].mobile_number = mobile_number;
            csvJsonData[index].about_me = about_me;
            csvJsonData[index].hair_color = hair_color;
            csvJsonData[index].eye_color = eye_color;
            csvJsonData[index].occupation = occupation;
            csvJsonData[index].what_he_is_looking_for = what_he_is_looking_for;
            csvJsonData[index].relationship_status = relationship_status;
            csvJsonData[index].isPrivate = isPrivate;
            csvJsonData[index].location = {
                type: "Point",
                coordinates: [latitude, longitude]
            };
            csvJsonData[index].profile_image_url = "profile_image_url";
        }

        if (csvJsonData && count === csvJsonData.length - 1) {
            const tempCsvJsonData = csvJsonData.map((ele) => {
                const { latitude, longitude, ...rest } = ele;
                return ({ ...rest });
            });
            req.csvJsonData = tempCsvJsonData;
            next();
        }

        count += 1;
    });
}

/**
 * Edit users
 * @param {*object} obj 
 * @param {*function} cb 
 */
var multiUsersEdit = function (users, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');

            let count = 0;
            users.forEach((ele) => {
                const { username, ...rest } = ele;
                collection.updateOne({ username }, { $set: { ...rest }}).then((err, res) => {
                    console.log("count ===> ", count);
                    if (users.length - 1 === count) {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, res, cb);
                    }

                    count++;
                });
            });
        }
    })
}

module.exports = {
    multiUsresSignup,
    moldeUserData,
    editUsersData,
    multiUsersEdit
}