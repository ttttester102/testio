var express = require('express');
var router = express.Router();
var { validate, httpResponse } = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR } = require("../operations/constant");
var { login } = require("../operations/operation");

/**
 * Login
 */
router.post("/signin", function (req, res) {
    validate("signin", req.body, function (status, keys) {
        if(!status){
            httpResponse(req, res, VALIDATE_ERROR, keys);
            return;
        }

        login(req.params, (status, response) => {
            httpResponse(req, res, status, response);
        });
    });
});


module.exports = router;