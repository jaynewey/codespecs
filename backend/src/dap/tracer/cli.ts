import { exec } from "child_process";
import path from "path";

import Tracer from "./tracer";

const args = process.argv.slice(2);

const usage = `Usage:
$ cli <configFile(.ts|.js)>`;

if (!args?.[0] || ["-h", "--help"].includes(args?.[0])) {
  console.log(usage);
} else if (!args?.[0]?.endsWith(".ts") && !args?.[0]?.endsWith(".js")) {
  console.log("Config must be on of (.ts|.js).");
  console.log(usage);
} else {
  // parse config
  const configPath = path.resolve(process.cwd(), args[0]);
  const configDir = path.dirname(configPath);
  import(configPath).then((configModule) => {
    const config = configModule.default;

    // run debug adapter
    const adapter = exec(config.adapterCommand);

    adapter.on("spawn", () => {
      const tracer = new Tracer();
      // print live trace to stdout
      let seq = 0;
      tracer.on("pushLine", (line) => {
        const lineStr = JSON.stringify({ ...line, ...{ seq: seq } });
        seq += 1;
        console.log(`Content-Length: ${lineStr.length}\r\n\r\n${lineStr}`);
      });

      // run tracer
      tracer.traceProgram(
        path.resolve(configDir, config.codePath),
        path.resolve(configDir, config?.programPath ?? config.codePath),
        config.language,
        config.includer,
        config?.entrypoint
      );
    });
  });
}
