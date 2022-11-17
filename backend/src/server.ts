import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import cors from "@fastify/cors";

const server: FastifyInstance = Fastify({});
server.register(cors, {
  origin: "*"
})

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

const start = async () => {
  try {
    await server.listen({ port: 8081, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
