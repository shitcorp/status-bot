"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hostmodel_1 = __importDefault(require("./core/hostmodel"));
var discord_js_light_1 = __importDefault(require("discord.js-light"));
var mongoose_1 = __importDefault(require("mongoose"));
var Agenda = require("agenda");
var job_1 = __importDefault(require("./core/job"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
(function init() {
    return __awaiter(this, void 0, void 0, function () {
        var PREFIX, PROBE_INTERVAL, MONGO_CONNECTION, agenda, client;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("dotenv")); })];
                case 1:
                    (_a.sent()).config();
                    PREFIX = process.env.PREFIX || "$";
                    PROBE_INTERVAL = process.env.PROBE_INTERVAL || "*/30 * * * *";
                    MONGO_CONNECTION = process.env.MONGO_CONNECTION || "";
                    agenda = new Agenda({
                        db: {
                            address: MONGO_CONNECTION,
                            options: {
                                useNewUrlParser: true,
                                useUnifiedTopology: true,
                            },
                        },
                    });
                    // define and start our agenda job
                    agenda.define("probe_job", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            job_1.default();
                            client.emit("probe");
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, agenda.start()];
                case 2:
                    _a.sent();
                    //@ts-ignore
                    return [4 /*yield*/, agenda.every(PROBE_INTERVAL, "probe_job")];
                case 3:
                    //@ts-ignore
                    _a.sent();
                    client = new discord_js_light_1.default.Client({
                        partials: ["MESSAGE", "CHANNEL"],
                        disableMentions: "everyone",
                        cacheGuilds: true,
                        cacheChannels: true,
                        cacheOverwrites: false,
                        cacheRoles: true,
                        cacheEmojis: true,
                        cachePresences: false,
                        // @ts-ignore
                        cacheMembers: false,
                        ws: {
                            intents: ["GUILDS", "GUILD_MESSAGES"],
                        },
                    });
                    dbinit(MONGO_CONNECTION);
                    // @ts-ignore
                    client.emojiMap = {
                        "-": "🟥",
                        "+": "🟩",
                    };
                    /**
                     *  Mini  "Command Handler"
                     */
                    client.on("message", function (msg) {
                        // onyl the bot owner should be able to run commands
                        if (msg.author.id !== process.env.OWNER)
                            return;
                        // if its -1 no prefix was given
                        if (msg.content.indexOf(PREFIX) !== 0)
                            return;
                        var args = msg.content.slice(PREFIX.length).trim().split(/ +/g);
                        // @ts-ignore
                        var command = args.shift().toLowerCase();
                        switch (command) {
                            case "statusmsg":
                                var array_1 = [];
                                var monitors = fs_1.readFileSync(path_1.default.join(__dirname + "../../monitors.json"));
                                var monitorObject = JSON.parse(monitors.toString());
                                Object.entries(monitorObject).map(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var hostModel, newHost, i, embed, statusmsg;
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
                                                    if (hostModel.statusmsg.channel !== "" ||
                                                        hostModel.statusmsg.message !== "")
                                                        return [2 /*return*/];
                                                    for (i = 0; i < hostModel.probes.length; i++) {
                                                        array_1.push(
                                                        //@ts-ignore
                                                        client.emojiMap[hostModel.probes[i].startsWith("UP_") ? "+" : "-"]);
                                                    }
                                                    embed = new discord_js_light_1.default.MessageEmbed()
                                                        .addField(key, array_1.join(""))
                                                        // change color to red when service is down
                                                        .setColor(hostModel.probes[hostModel.probes.length - 1].startsWith("UP_")
                                                        ? "GREEN"
                                                        : "RED");
                                                    return [4 /*yield*/, msg.channel.send(embed)];
                                                case 4:
                                                    statusmsg = _b.sent();
                                                    hostModel.statusmsg.channel = statusmsg.channel.id;
                                                    hostModel.statusmsg.message = statusmsg.id;
                                                    return [4 /*yield*/, hostModel.save()];
                                                case 5:
                                                    _b.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                });
                                break;
                        }
                    });
                    // new probe, edit statusmsg
                    client.on("probe", function () { return __awaiter(_this, void 0, void 0, function () {
                        var allDocs, allDocs_1, allDocs_1_1, doc, channel, msg, array, i, embed, e_1_1;
                        var e_1, _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, hostmodel_1.default.find()];
                                case 1:
                                    allDocs = _c.sent();
                                    // if no docs are found we can safely return
                                    if (!allDocs)
                                        return [2 /*return*/];
                                    _c.label = 2;
                                case 2:
                                    _c.trys.push([2, 10, 11, 16]);
                                    allDocs_1 = __asyncValues(allDocs);
                                    _c.label = 3;
                                case 3: return [4 /*yield*/, allDocs_1.next()];
                                case 4:
                                    if (!(allDocs_1_1 = _c.sent(), !allDocs_1_1.done)) return [3 /*break*/, 9];
                                    doc = allDocs_1_1.value;
                                    if (!(doc.statusmsg.channel !== "" && doc.statusmsg.message !== "")) return [3 /*break*/, 8];
                                    return [4 /*yield*/, ((_b = client.guilds.cache
                                            .get(process.env.GUILD ? process.env.GUILD : "")) === null || _b === void 0 ? void 0 : _b.channels.fetch(doc.statusmsg.channel))];
                                case 5:
                                    channel = _c.sent();
                                    if (!channel)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, channel.messages.fetch(doc.statusmsg.message)];
                                case 6:
                                    msg = _c.sent();
                                    array = [];
                                    for (i = 0; i < doc.probes.length; i++) {
                                        array.push(
                                        //@ts-ignore
                                        client.emojiMap[doc.probes[i].startsWith("UP_") ? "+" : "-"]);
                                    }
                                    embed = new discord_js_light_1.default.MessageEmbed()
                                        .addField(doc._id, array.join(""))
                                        // change color to red when service is down
                                        .setColor(doc.probes[doc.probes.length - 1].startsWith("UP_")
                                        ? "GREEN"
                                        : "RED");
                                    return [4 /*yield*/, msg.edit(embed)];
                                case 7:
                                    _c.sent();
                                    _c.label = 8;
                                case 8: return [3 /*break*/, 3];
                                case 9: return [3 /*break*/, 16];
                                case 10:
                                    e_1_1 = _c.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 16];
                                case 11:
                                    _c.trys.push([11, , 14, 15]);
                                    if (!(allDocs_1_1 && !allDocs_1_1.done && (_a = allDocs_1.return))) return [3 /*break*/, 13];
                                    return [4 /*yield*/, _a.call(allDocs_1)];
                                case 12:
                                    _c.sent();
                                    _c.label = 13;
                                case 13: return [3 /*break*/, 15];
                                case 14:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 15: return [7 /*endfinally*/];
                                case 16: return [2 /*return*/];
                            }
                        });
                    }); });
                    client.on("ready", function () {
                        console.log("Client is ready and logged in");
                        job_1.default();
                    });
                    client.login(process.env.TOKEN);
                    return [2 /*return*/];
            }
        });
    });
})();
function dbinit(connection_string) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            mongoose_1.default.connect(connection_string, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            db = mongoose_1.default.connection;
            db.on("error", function (error) {
                console.error(error);
            });
            db.once("open", function () {
                console.log("MongoDB Connection was established");
            });
            return [2 /*return*/];
        });
    });
}
