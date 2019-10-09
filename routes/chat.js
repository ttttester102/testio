var { addUserInSocket, disconnectUser, saveChatMessage } = require("../operations/controller/chat");
var common = require("../operations/common");
var { verifyJsonTokenWithSocket } = require("../operations/operation");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA, ERROR } = require("../operations/constant");

var chat = function (socket) {
    this.socket = socket;
}

chat.prototype.ping = function () {
    this.socket.on('/ping', function (data) {
        this.socket.emit('/ping', data);
    }.bind(this));
}

chat.prototype.connectUser = function () {
    this.socket.on('/connect_user', function (data) {
        common.validate("connect_user", data, (status, keys) => {
            if (status) verifyJsonTokenWithSocket((status, response) => {
                if (status === ERROR) this.socket.emit('/response/connect_user', response);
                else addUserInSocket(data, (status, response) => this.socket.emit('/response/connect_user', common.socketResponse(SUCCESS, response)));
            });
            else this.socket.emit('/response/connect_user', common.socketResponse(VALIDATE_ERROR, keys));
        });
    }.bind(this));
}

chat.prototype.disconnectUser = function () {
    this.socket.on('/disconnect_user', function (data) {
        common.validate("disconnect_user", data, (status, keys) => {
            if (status) verifyJsonTokenWithSocket((status, response) => {
                if (status === ERROR) this.socket.emit('/response/disconnect_user', response);
                else disconnectUser(data, (status, response) => this.socket.emit('/response/disconnect_user', common.socketResponse(SUCCESS, response)));
            });
            else this.socket.emit('/response/disconnect_user', common.socketResponse(VALIDATE_ERROR, keys));
        });
    }.bind(this));
}

chat.prototype.saveUserMessage = function () {
    this.socket.on('/save_user_message', function (data) {
        common.validate("save_user_message", data, (status, keys) => {
            if (status) verifyJsonTokenWithSocket((status, response) => {
                if (status === ERROR) this.socket.emit('/response/save_user_message', response);
                else saveChatMessage(data, (status, response) => this.socket.emit('/response/save_user_message', common.socketResponse(SUCCESS, response)));
            });
            else this.socket.emit('/response/save_user_message', common.socketResponse(VALIDATE_ERROR, keys));
        });
    }.bind(this));
}

chat.prototype.peerToPeerMessage = function () {
    this.socket.on('/user/chat', function (data) {
        this.socket.emit('/user/chat', data);
    }.bind(this));
}

module.exports = chat;