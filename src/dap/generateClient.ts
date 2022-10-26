import { writeFileSync } from "fs";
import path from "path";

import clientTemplate from "./clientTemplate";
import * as schema from "./generated/debugAdapterProtocol.json";

const OUT_FILE = "./generated/dapClient.ts";
writeFileSync(path.resolve(__dirname, OUT_FILE), clientTemplate(schema));
