var connection = require("./connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE
} = require("./constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close
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
            var { email } = obj;
            collection.find({ email }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if( data && data.length !== 0){
                    close(client, SUCCESS, data[0], cb);
                }else close(client, NOVALUE, err, cb);
            });
        }
    })
}

module.exports = {
    login
}