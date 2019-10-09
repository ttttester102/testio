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
    CONNECTED,
    DISCONNECTED,
    ACTIVE,
    DELETED
} = require('../constant');

/**
 * Add chat user
 * @param {* object} obj 
 * @param {* function} cb 
 */
var addUserInSocket = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('socket_users');
            var { user_id, user_socket_id } = obj;

            collection.find({
                userId: new ObjectId(user_id),
                userSocketId: new ObjectId(user_socket_id)
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length === 0) {
                    collection.insertOne({
                        userId: new ObjectId(user_id),
                        userSocketId: new ObjectId(user_socket_id),
                        status: CONNECTED,
                        createdAt: new Date().getTime(),
                        updatedAt: new Date().getTime()
                    }, (err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else {
                            close(client, SUCCESS, {
                                message: "User save successfully."
                            }, cb);
                        }
                    });
                } else collection.updateOne({
                    userId: new ObjectId(user_id),
                    userSocketId: new ObjectId(user_socket_id)
                }, {
                    status: CONNECTED,
                    updatedAt: new Date().getTime()
                }, (err, value) => {
                    if (err) close(client, ERROR, err, cb);
                    else {
                        const { result: data } = value;
                        if (data && data.n) {
                            close(client, SUCCESS, {
                                status: data && data.nModified >= 1 ? "Changed" : "Not Changed",
                                data: value,
                                message: "User save successfully."
                            }, cb);
                        } else close(client, SUCCESS, {
                            data: value.data,
                            message: "No value found."
                        }, cb);
                    }
                });
            });
        }
    });
}

/**
 * Get all added socket requests
 * @param {* object} obj 
 * @param {* function} cb 
 */
var getSocketUsersList = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('socket_users');
            var { page, page_size } = obj;

            collection.find({ status: CONNECTED, deletedStatus: ACTIVE }, {
                skip: page === 1 ? 0 : page * page_size,
                limit: page_size
            }, (err, data) => {
                if (err) close(client, ERROR, err, cb);
                else data.toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, {
                        results: data
                    }, cb);
                });
            });
        }
    });
}

/**
 * Disconnect user on disconnect
 * @param {* object} obj 
 * @param {* function} cb 
 */
var disconnectUser = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('socket_users');
            var { user_id, user_socket_id } = obj;

            collection.updateOne({
                userId: new ObjectId(user_id),
                userSocketId: new ObjectId(user_socket_id)
            }, {
                $set: {
                    status: DISCONNECTED,
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
                            message: "Disconnect user."
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

/**
 * Save chat messages
 * @param {* object} obj 
 * @param {* function} cb 
 */
var saveChatMessage = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('messages');
            var { user_id, peer_user_id, message } = obj;

            collection.insertOne({
                userId: new ObjectId(user_id),
                peerUserId: new ObjectId(peer_user_id),
                message,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }, (err, data) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    close(client, SUCCESS, {
                        data: {
                            message
                        },
                        message: "Disconnect user."
                    }, cb);
                }
            });
        }
    });
}

module.exports = {
    addUserInSocket,
    getSocketUsersList,
    disconnectUser,
    saveChatMessage
}