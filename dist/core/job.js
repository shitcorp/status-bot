"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var hostmodel_1 = __importDefault(require("./hostmodel"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var c, monitors, monitorObject;
    return __generator(this, function (_a) {
        c = require("@aero/centra");
        monitors = fs_1.readFileSync(path_1.default.join(__dirname + "../../../monitors.json"));
        monitorObject = JSON.parse(monitors.toString());
        Object.entries(monitorObject).map(function (_a) {
            var key = _a[0], value = _a[1];
            return __awaiter(void 0, void 0, void 0, function () {
                var hostModel, newHost, res, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, hostmodel_1.default.findOne({ _id: key })];
                        case 1:
                            hostModel = _b.sent();
                            if (!!hostModel) return [3 /*break*/, 3];
                            newHost = new hostmodel_1.default({
                                _id: key,
                                host: value.host,
                                probes: [],
                                statusmsg: {
                                    channel: "",
                                    message: "",
                                },
                            });
                            return [4 /*yield*/, newHost.save()];
                        case 2:
                            hostModel = _b.sent();
                            _b.label = 3;
                        case 3:
                            // make sure the probes array doesnt extend a certain size
                            while (hostModel.probes.length >
                                parseInt(process.env.MAX_PROBES ? process.env.MAX_PROBES : "20")) {
                                hostModel.probes.shift();
                            }
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 10, , 12]);
                            return [4 /*yield*/, c(value.host, "GET").send()];
                        case 5:
                            res = _b.sent();
                            if (!res)
                                return [2 /*return*/];
                            if (!(res.statusCode >= 200 && res.statusCode <= 500)) return [3 /*break*/, 7];
                            // host is up
                            hostModel.probes.push("UP_" + Date.now());
                            return [4 /*yield*/, hostModel.save()];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 7:
                            hostModel.probes.push("DOWN_" + Date.now());
                            return [4 /*yield*/, hostModel.save()];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            e_1 = _b.sent();
                            // host probably down
                            hostModel.probes.push("DOWN_" + Date.now());
                            return [4 /*yield*/, hostModel.save()];
                        case 11:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        });
        return [2 /*return*/];
    });
}); });