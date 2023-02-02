import { exec } from "child_process";
import path from "path";

import traceProgram from "./traceProgram";

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
      // run tracer, retry if fails
      traceProgram(
        path.resolve(configDir, config.codePath),
        path.resolve(configDir, config?.programPath ?? config.codePath),
        config.language,
        config.includer
      ).then((programTrace) => {
        console.log(JSON.stringify(programTrace, null, 2));
      });
    });
  });
}
