var connection = require('../connection');
var {
    ObjectId
} = require('mongodb');
var {
    close
} = require('../common');
var {
    ERROR,
    SUCCESS,
    PRESENT,
    NOVALUE,
    ACCEPCT_CONTACT_RESPONSE,
    DECLINE_CONTACT_RESPONSE
} = require('../constant');

var jwt = require("jsonwebtoken");
var common = require("../common");

/**
 * Request user
 * @param {* object} obj 
 * @param {* function} cb 
 */
var requestUser = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users_request');
            var { _id, user_id } = obj;

            collection.find({
                userId: new ObjectId(_id),
                requestedId: new ObjectId(user_id)
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length === 0) {
                    collection.insertOne({
                        userId: new ObjectId(_id),
                        requestedId: new ObjectId(user_id),
                        deletedStatus: 0,
                        status: 0,
                        createdAt: new Date().getTime(),
                        updatedAt: new Date().getTime()
                    }, (err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else {
                            close(client, SUCCESS, {
                                message: "Request sent successfully."
                            }, cb);
                        }
                    });
                } else close(client, PRESENT, {
                    message: "Reuqest is already present."
                }, cb);
            });
        }
    });
}

/**
 * Response user
 * @param {* object} obj 
 * @param {* function} cb 
 */
var responseUser = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users_request');
            var { requestId, requestStatus } = obj;

            collection.updateOne({ _id: new ObjectId(requestId) }, {
                $set: {
                    status: requestStatus ? ACCEPCT_CONTACT_RESPONSE : DECLINE_CONTACT_RESPONSE,
                    updatedAt: new Date().getTime()
                }
            }, (err, value) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    const { result: data } = value;
                    if (data && data.n) {
                        close(client, SUCCESS, {
                            status: data && data.nModified >= 1 ? "Changed" : "Not Changed",
                            data: value,
                            message: requestStatus === ACCEPCT_CONTACT_RESPONSE ? "Request accepted successfully." : "Request declined successfully."
                        }, cb);
                    } else close(client, SUCCESS, {
                        data: value.data,
                        message: "No value found."
                    }, cb);
                }
            });
        }
    });
}

module.exports = {
    requestUser,
    responseUser
}