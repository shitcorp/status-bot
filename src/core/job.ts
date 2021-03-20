import hostmodel from "./hostmodel";
import { readFileSync } from "fs";
import path from "path";

export default async () => {
  //@ts-ignore
  const c = require("@aero/centra");
  const monitors = readFileSync(
    path.join(__dirname + "../../../monitors.json")
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

      // make sure the probes array doesnt extend a certain size
      while (
        hostModel.probes.length >
        parseInt(process.env.MAX_PROBES ? process.env.MAX_PROBES : "20")
      ) {
        hostModel.probes.shift();
      }

      try {
        const res = await c(value.host, "GET").send();

        if (!res) return;
        if (res.statusCode >= 200 && res.statusCode <= 500) {
          // host is up
          hostModel.probes.push(`UP_${Date.now()}`);
          await hostModel.save();
        } else {
          hostModel.probes.push(`DOWN_${Date.now()}`);
          await hostModel.save();
        }
      } catch (e) {
        // host probably down
        hostModel.probes.push(`DOWN_${Date.now()}`);
        await hostModel.save();
      }
    }
  );
};
