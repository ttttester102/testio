var express = require('express');
var router = express.Router();

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR } = require("../operations/constant");
var { signup } = require("../operations/operation");

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

/**
 * Signup
 */
router.post("/signup", function(req, res){
    common.validate("signup", req.body,(status, keys)=>{
        if(status) signup(req.body, (status, response) => common.httpResponse(req, res, status, response));
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
