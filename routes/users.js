var express = require('express');
var router = express.Router();
var csvtojson = require('csvtojson');
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA } = require("../operations/constant");
var { signup, login, verifyJsonToken, editUserProfile } = require("../operations/operation");

//Routes
var contact = require("../routes/contact");

/**
 * Login
 */
router.post("/login", function (req, res) {
    common.validate("signin", req.body, (status, keys) => {
        if (status) login(req.body, (status, response) => common.httpResponse(req, res, status, response));
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
});

/**
 * Signup
 */
router.post("/signup", function (req, res) {
    common.validate("signup", req.body, (status, keys) => {
        if (status) signup(req.body, (status, response) => common.httpResponse(req, res, status, response));
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
});

/**
 * Get user data
 */
router.post("/detail", (req, res, next) => {
    common.validate("detail", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res, next) => {
    res.json({
        message: req[AUTH_USER_DATA]
    })
});

/**
 * Edit profile
 */
router.post("/editprofile", (req, res, next) => {
    common.validate("editprofile", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    req.body._id = req[AUTH_USER_DATA] && req[AUTH_USER_DATA]._id ? req[AUTH_USER_DATA]._id : null;
    editUserProfile(req.body, (status, response) => common.httpResponse(req, res, status, response));
});

/* Convert csv file to json */
router.get('/csv/to/json', async (req, res, next) => {
    var csvFilePath = path.join(__dirname, '../public/addresses.csv');
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    res.send(jsonArray);
});

/**
 * Search user
 */
router.post("/search", (req, res, next) => {
    common.validate("search", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res, next) => {
    res.json({
        message: req[AUTH_USER_DATA]
    })
});

/** Contact user */
router.use("/contact", contact);

module.exports = router;
