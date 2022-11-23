import cors from "@fastify/cors";
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";

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

const languages: RouteShorthandOptions = {
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

server.get("/api/languages/", languages, async () => {
  return [
    "Python (3.8.1)",
    "Python (2.7.17)",
    "JavaScript (Node.js 12.14.0)",
    "Java (OpenJDK 13.0.1)",
  ];
});

const start = async () => {
  try {
    await server.listen({ port: 8081, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
