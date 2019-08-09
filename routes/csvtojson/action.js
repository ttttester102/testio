var express = require('express');
var router = express.Router();
var csvtojson = require('csvtojson');
var path = require('path');

var common = require("../../operations/common");
var { multiUsresSignup, moldeUserData, editUsersData, multiUsersEdit } = require("../../operations/save_files_data/users");
var {
    USERS_CSV_JSON_DATA
} = require("../../operations/constant");

/* Convert csv file to json and add users*/
router.get('/users', async (req, res, next) => {
    var csvFilePath = path.join(__dirname, '../../public/users.csv');
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    req.csvJsonData = jsonArray;
    next();
}, moldeUserData, (req, res) => {
    const jsonArray = req[USERS_CSV_JSON_DATA];
    multiUsresSignup(jsonArray, (status, response) => common.httpResponse(req, res, status, response));
});

/* Convert csv file to json and edit users */
router.get('/users/edit', async (req, res, next) => {
    var csvFilePath = path.join(__dirname, '../../public/edit_users.csv');
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    req.csvJsonData = jsonArray;
    next();
}, editUsersData, (req, res) => {
    multiUsersEdit(req.csvJsonData, (status, response) => common.httpResponse(req, res, status, response));
});

module.exports = router;
