import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";

const server: FastifyInstance = Fastify({});

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

server.get("/", opts, async () => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
