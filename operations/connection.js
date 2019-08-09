var { MongoClient } = require("mongodb");

/** Mongodb connection */
module.exports = function (cb) {
    // let uri = "mongodb://127.0.0.1";
    let uri = "mongodb://harpreetsinghkhattra:Ha872909066@ds239157.mlab.com:39157/liason";

    MongoClient.connect(uri, (err, client) => {
        console.log("err ===> ", err);
        if (err) cb(err, null);
        if (client) {
            // const db = client.db('testio');
            const db = client.db('liason');
            cb(null, db, client);
        }
    }
    );
}