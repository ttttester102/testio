var express = require("express");
var router = express.Router();

var { requestUser, responseUser } = require("../operations/controller/contact");
var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA } = require("../operations/constant");
var { verifyJsonToken } = require("../operations/operation");

/**
 * Create request
 */
router.post("/request", (req, res, next) => {
    common.validate("request", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];
    const { user_id } = req.body;

    requestUser({ _id, user_id }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Response request
 */
router.put("/response", (req, res, next) => {
    common.validate("response", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];
    const { requestId, requestStatus } = req.body;

    responseUser({ requestId, requestStatus }, (status, response) => common.httpResponse(req, res, status, response));
});

module.exports = router;