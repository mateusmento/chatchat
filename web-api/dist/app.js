"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importStar(require("mongoose"));
var http_1 = __importDefault(require("http"));
var dbUrl = 'mongodb://localhost:27017/chatchat';
var app = express_1.default();
var server = new http_1.default.Server(app);
var io = socket_io_1.default(server);
var UserOnlineSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    socketId: { type: String, required: true },
});
var OnlineUser = mongoose_1.default.model('User', UserOnlineSchema);
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    mongoose_1.default.connect(dbUrl, { useNewUrlParser: true });
                    mongoose_1.default.connection.on('connected', resolve);
                    mongoose_1.default.connection.on('error', reject);
                })];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = {};
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _a.sent();
                    app.use(express_1.default.urlencoded({ extended: false }));
                    app.use(express_1.default.static(__dirname + '/../static'));
                    io.on('connection', function (socket) {
                        socket.on('user connected', function (username) {
                            var user = new OnlineUser({ username: username, socketId: socket.id });
                            console.log(username);
                            user.save();
                        });
                        socket.on('chat message', function (data) {
                            socket.broadcast.emit('chat message', data.username + ": " + data.message);
                        });
                        socket.on('private chat message', function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var onlineUser, socketId;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, OnlineUser.findOne({ username: data.friend })];
                                    case 1:
                                        onlineUser = _a.sent();
                                        if (onlineUser) {
                                            socketId = onlineUser.socketId;
                                            io.to(socketId).emit('chat message', data.username + ": " + data.message);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
                            var onlineUser;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, OnlineUser.remove({ socketId: socket.id })];
                                    case 1:
                                        onlineUser = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    server.listen(3000);
                    return [2 /*return*/];
            }
        });
    });
}
main();
