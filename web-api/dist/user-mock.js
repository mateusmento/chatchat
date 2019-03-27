"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockedUser = /** @class */ (function () {
    function MockedUser(name, username, password) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.isInvalid = false;
    }
    MockedUser.prototype.comparePassword = function (password) {
        return this.password == password;
    };
    return MockedUser;
}());
exports.USER_MOCK = [
    new MockedUser('Mateus Sarmento', 'mateusmento', '123'),
];
