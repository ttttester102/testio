var { MongoClient } = require("mongodb");

/** Mongodb connection */
module.exports = function (cb) {
    let uri = "mongodb://127.0.0.1";

    MongoClient.connect(uri, (err, client) => {
        if (err) cb(err, null);
        if (client) {
            const db = client.db('testio');
            cb(null, db, client);
        }
    }
    );
}