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
        console.log(res);

        if (!res) return;

        let down = false;

        if (value.expect.status) {
          if (res.statusCode !== value.expect.status) {
            down = true;
          }
        }

        if (value.expect.body) {
          switch (value.expect.body.type) {
            case "regex":
              // do regex matching here
              const pattern = new RegExp(value.expect.body.match);
              if (res.body.toString().test(pattern) === null) {
                down = true;
                
              }
              break;
            case "exact":
              if (res.body.toString() !== value.expect.body.match) {
                down = true;
              }
              break;
            default:
              throw new Error(
                'Only "regex" or "exact" are allowed in the type field.'
              );
          }
        }

        hostModel.probes.push(down === true ? `DOWN_${Date.now()}` : `UP_${Date.now()}`); 
        await hostModel.save();

      } catch (e) {
        console.error(e);
        // host probably down
        hostModel.probes.push(`DOWN_${Date.now()}`);
        await hostModel.save();
      }
    }
  );
};
