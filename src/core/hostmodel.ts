import { Schema, model } from 'mongoose';

const hostschema = new Schema({
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
export default new model('hosts', hostschema);