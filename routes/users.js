var express = require('express');
var router = express.Router();

var common = require("../operations/common");
var { SUCCESS } = require("../operations/constant");

/**
 * Login
 */
router.post("/login", function(req, res){
    common.validate("signin", {
        email: "harpreet@gmail.com",
        password: "872909066"
    },(status, keys)=>{
        common.close(null, SUCCESS, {
            status,
            keys
        });
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
