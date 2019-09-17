var express = require("express");
var router = express.Router();

var { requestUser, responseUser, getRequestList, getMatch } = require("../operations/controller/contact");
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

/**
 * Get request
 */
router.post("/request/list", (req, res, next) => {
    common.validate("request_list", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getRequestList(Object.assign(req.body, { _id }), (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Find match
 */
router.post("/match", (req, res, next) => {
    common.validate("match", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getMatch(Object.assign(req.body, { _id }), (status, response) => common.httpResponse(req, res, status, response));
});

module.exports = router;