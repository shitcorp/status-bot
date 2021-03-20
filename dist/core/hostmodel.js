"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var hostschema = new mongoose_1.Schema({
    _id: String,
    host: String,
    // status_time (only for future reference)
    probes: Array,
    statusmsg: {
        channel: String,
        message: String
    }
});
//@ts-ignore
exports.default = new mongoose_1.model('hosts', hostschema);
