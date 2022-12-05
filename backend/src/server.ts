import cors from "@fastify/cors";
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";

import * as exampleTrace from "./exampleTrace.json";
import { languages } from "./languages";

const server: FastifyInstance = Fastify({});
server.register(cors, {
  origin: "*",
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          hello: {
            type: "string",
          },
        },
      },
    },
  },
};

server.get("/api/", opts, async () => {
  return { hello: "world" };
});

server.post("/api/run/", async () => {
  return exampleTrace;
});

const languagesRoute: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
};

server.get("/api/languages/", languagesRoute, async () => {
  return languages;
});

const start = async () => {
  try {
    await server.listen({ port: 8081, host: "0.0.0.0" });
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};
start();
