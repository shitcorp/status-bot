import hostmodel from "./core/hostmodel";
import Discord from "discord.js-light";
import mongoose from "mongoose";
const Agenda = require("agenda");
import job from "./core/job";
import { readFileSync } from "fs";
import path from "path";

(async function init() {
  (await import("dotenv")).config();

  const PREFIX = process.env.PREFIX || "$";
  const PROBE_INTERVAL = process.env.PROBE_INTERVAL || "*/30 * * * *";
  const MONGO_CONNECTION = process.env.MONGO_CONNECTION || "";

  // create a new agenda instance
  const agenda = new Agenda({
    db: {
      address: MONGO_CONNECTION,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  });

  // define and start our agenda job
  agenda.define("probe_job", async () => {
    job();
    client.emit("probe");
  });
  await agenda.start();
  //@ts-ignore
  await agenda.every(PROBE_INTERVAL, "probe_job");

  // instantiate discord client
  const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL"],
    disableMentions: "everyone",
    cacheGuilds: true,
    cacheChannels: true,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
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
  client.on("message", (msg) => {
    // onyl the bot owner should be able to run commands
    if (msg.author.id !== process.env.OWNER) return;
    // if its -1 no prefix was given
    if (msg.content.indexOf(PREFIX) !== 0) return;

    const args = msg.content.slice(PREFIX.length).trim().split(/ +/g);
    // @ts-ignore
    const command = args.shift().toLowerCase();

    switch (command) {
      case "statusmsg":
        const array: any = [];

        const monitors = readFileSync(
          path.join(__dirname + "../../monitors.json")
        );
        const monitorObject = JSON.parse(monitors.toString());

        Object.entries(monitorObject).map(
          async ([key, value]: [key: any, value: any]) => {
            let hostModel = await hostmodel.findOne({ _id: key });

            // if there was no document found, we have to set one
            if (!hostModel) {
              const newHost = new hostmodel({
                _id: key,
                host: value.host,
                probes: [],
                statusmsg: {
                  channel: "",
                  message: "",
                },
              });
              hostModel = await newHost.save();
            }

            if (
              hostModel.statusmsg.channel !== "" ||
              hostModel.statusmsg.message !== ""
            )
              return;

            for (let i = 0; i < hostModel.probes.length; i++) {
              array.push(
                //@ts-ignore
                client.emojiMap[
                  hostModel.probes[i].startsWith("UP_") ? "+" : "-"
                ]
              );
            }

            const embed = new Discord.MessageEmbed()
              .addField(key, array.join(""))
              // change color to red when service is down
              .setColor(
                hostModel.probes[hostModel.probes.length - 1].startsWith("UP_")
                  ? "GREEN"
                  : "RED"
              );

            const statusmsg = await msg.channel.send(embed);

            hostModel.statusmsg.channel = statusmsg.channel.id;
            hostModel.statusmsg.message = statusmsg.id;

            await hostModel.save();
          }
        );

        break;
    }
  });

  
  // new probe, edit statusmsg
  client.on("probe", async () => {
    // query all docs
    let allDocs = await hostmodel.find();
    // if no docs are found we can safely return
    if (!allDocs) return;

    for await (const doc of allDocs) {
      if (doc.statusmsg.channel !== "" && doc.statusmsg.message !== "") {
        const channel = await client.guilds.cache
          .get(process.env.GUILD ? process.env.GUILD : "")
          ?.channels.fetch(doc.statusmsg.channel);
        if (!channel) return;
        //@ts-ignore
        const msg = await channel.messages.fetch(doc.statusmsg.message);

        const array = [];
        for (let i = 0; i < doc.probes.length; i++) {
          array.push(
            //@ts-ignore
            client.emojiMap[doc.probes[i].startsWith("UP_") ? "+" : "-"]
          );
        }

        const embed = new Discord.MessageEmbed()
          .addField(doc._id, array.join(""))
          // change color to red when service is down
          .setColor(
            doc.probes[doc.probes.length - 1].startsWith("UP_")
              ? "GREEN"
              : "RED"
          );

        await msg.edit(embed);
      }
    }
  });

  client.on("ready", () => {
    console.log("Client is ready and logged in");
    job();
  });

  client.login(process.env.TOKEN);
})();

async function dbinit(connection_string: string) {
  mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error(error);
  });

  db.once("open", () => {
    console.log("MongoDB Connection was established");
  });
}
